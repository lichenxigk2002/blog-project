package com.example.blogbackend.service.impl;

import com.example.blogbackend.config.CrossbellConfig;
import com.example.blogbackend.dto.CrossbellPublishRequest;
import com.example.blogbackend.dto.CrossbellPublishResult;
import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.service.IArticlesService;
import com.example.blogbackend.service.CrossbellService;
import com.example.blogbackend.service.ArticleCopyrightService;
import com.example.blogbackend.entity.ArticleCopyright;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionReceipt;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.List;
import java.util.Arrays;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.EthGetBalance;

/**
 * Crossbell 服务实现类
 */
@Slf4j
@Service
public class CrossbellServiceImpl implements CrossbellService {

  @Autowired
  private CrossbellConfig crossbellConfig;

  @Autowired
  private IArticlesService articlesService;

  @Autowired
  private ArticleCopyrightService articleCopyrightService;

  // 配置 OkHttpClient 以避免重定向循环
  private final OkHttpClient httpClient = new OkHttpClient.Builder()
      .followRedirects(false) // 禁用自动重定向
      .followSslRedirects(false) // 禁用 SSL 重定向
      .connectTimeout(30, TimeUnit.SECONDS) // 连接超时
      .readTimeout(60, TimeUnit.SECONDS) // 读取超时
      .writeTimeout(60, TimeUnit.SECONDS) // 写入超时
      .retryOnConnectionFailure(true) // 连接失败时重试
      .build();

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Override
  public CrossbellPublishResult publishArticle(CrossbellPublishRequest request) {
    try {
      log.info("开始发布文章到 Crossbell: {}", request.getArticleId());

      // 1. 从数据库获取文章信息
      Articles article = articlesService.getById(request.getArticleId());
      if (article == null) {
        return CrossbellPublishResult.builder()
            .success(false)
            .errorMessage("文章不存在：ID " + request.getArticleId())
            .build();
      }

      // 2. 构建 Note 内容（使用数据库中的真实数据）
      String noteContent = buildNoteContent(article, request);

      // 3. 调用 Crossbell API 发布
      String result = publishToCrossbell(noteContent);

      // 4. 处理发布结果
      if (result != null && !result.contains("simulation")) {
        // 如果是真实的交易哈希，等待确认
        String noteId = waitForTransactionAndGetNoteId(result);

        if (noteId != null) {
          String crossbellUrl = getCrossbellUrl(noteId);

          // 5. 更新数据库中的区块链信息
          updateBlockchainInfo(request.getArticleId(), result, noteId);

          return CrossbellPublishResult.builder()
              .success(true)
              .transactionHash(result)
              .noteId(noteId)
              .publishTime(LocalDateTime.now())
              .crossbellUrl(crossbellUrl)
              .build();
        } else {
          return CrossbellPublishResult.builder()
              .success(false)
              .errorMessage("发布失败：无法获取 Note ID")
              .build();
        }
      } else {
        return CrossbellPublishResult.builder()
            .success(false)
            .errorMessage("发布失败：智能合约调用失败或返回模拟值")
            .build();
      }

    } catch (Exception e) {
      log.error("发布到 Crossbell 失败", e);
      return CrossbellPublishResult.builder()
          .success(false)
          .errorMessage("发布失败：" + e.getMessage())
          .build();
    }
  }

  @Override
  public boolean verifyArticleOnChain(String noteId) {
    try {
      // 使用正确的 Crossbell API 端点验证 Note 是否存在
      String[] apiEndpoints = {
          "https://indexer.crossbell.io/v1/notes/" + noteId,
          "https://xsync.crossbell.io/api/notes/" + noteId,
          "https://indexer.crossbell.io/v1/characters/" + crossbellConfig.getCharacterId() + "/notes/" + noteId
      };

      for (String endpoint : apiEndpoints) {
        try {
          log.info("尝试验证 Note 存在性: {}", endpoint);

          Request request = new Request.Builder()
              .url(endpoint)
              .addHeader("Accept", "application/json")
              .addHeader("User-Agent", "Blog-Backend/1.0")
              .build();

          try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful() && response.body() != null) {
              JsonNode jsonNode = objectMapper.readTree(response.body().string());
              boolean exists = jsonNode.has("noteId") && !jsonNode.get("noteId").isNull();
              if (exists) {
                log.info("Note 验证成功: {}", noteId);
                return true;
              }
            }
          }
        } catch (Exception e) {
          log.warn("API 端点 {} 验证失败: {}", endpoint, e.getMessage());
          continue; // 尝试下一个端点
        }
      }

      log.warn("所有 API 端点都无法验证 Note: {}", noteId);
    } catch (Exception e) {
      log.error("验证文章上链状态失败: {}", noteId, e);
    }
    return false;
  }

  @Override
  public String getCrossbellUrl(String noteId) {
    return "https://crossbell.io/notes/" + noteId;
  }

  @Override
  public String getTransactionStatus(String txHash) {
    try {
      Web3j web3j = Web3j.build(new HttpService(crossbellConfig.getRpcUrl()));
      EthGetTransactionReceipt receipt = web3j.ethGetTransactionReceipt(txHash)
          .send();

      if (receipt.hasError()) {
        return "ERROR: " + receipt.getError().getMessage();
      }

      TransactionReceipt transactionReceipt = receipt.getTransactionReceipt().orElse(null);
      if (transactionReceipt != null) {
        return transactionReceipt.isStatusOK() ? "SUCCESS" : "FAILED";
      } else {
        return "PENDING";
      }
    } catch (Exception e) {
      log.error("获取交易状态失败: {}", txHash, e);
      return "ERROR: " + e.getMessage();
    }
  }

  /**
   * 构建 Note 内容
   */
  private String buildNoteContent(Articles article, CrossbellPublishRequest request) throws IOException {
    // 构建 Crossbell Note 的 metadata - 使用正确的格式
    String metadata = objectMapper.writeValueAsString(new Object() {
      public final String title = article.getTitle();
      public final String content = article.getContent();
      public final String[] tags = { "blog", "copyright", request.getLicenseType() };
      public final String[] sources = { "blog-admin" };
      public final String date_published = LocalDateTime.now().toString() + "Z";
      public final Object[] attributes = new Object[] {
          new Object() {
            public final String trait_type = "版权所有者";
            public final String value = request.getCopyrightHolder();
          },
          new Object() {
            public final String trait_type = "许可协议";
            public final String value = request.getLicenseType();
          },
          new Object() {
            public final String trait_type = "文章ID";
            public final String value = request.getArticleId().toString();
          },
          new Object() {
            public final String trait_type = "type";
            public final String value = "post";
          }
      };
    });

    return metadata;
  }

  /**
   * 发布到 Crossbell
   */
  private String publishToCrossbell(String noteContent) throws IOException {
    log.info("开始发布到真实的 Crossbell 区块链");

    // 检查必要的配置
    if (crossbellConfig.getPrivateKey() == null || crossbellConfig.getPrivateKey().isEmpty()) {
      log.error("Crossbell 私钥未配置，无法进行真实发布");
      return "0x" + System.currentTimeMillis() + "simulation";
    }

    if (crossbellConfig.getCharacterId() == null || crossbellConfig.getCharacterId().isEmpty()) {
      log.error("Crossbell Character ID 未配置，无法进行真实发布");
      return "0x" + System.currentTimeMillis() + "simulation";
    }

    try {
      // 直接使用智能合约发布
      return publishViaSmartContractWithLowerGas(noteContent);
    } catch (Exception e) {
      log.error("智能合约发布失败: {}", e.getMessage());
      return "0x" + System.currentTimeMillis() + "simulation";
    }
  }

  /**
   * 通过智能合约发布 Note（使用更低的 Gas 价格）
   */
  private String publishViaSmartContractWithLowerGas(String noteContent) throws Exception {
    log.info("尝试通过智能合约发布 Note（使用更低的 Gas 价格）");

    // 创建 Web3j 实例
    Web3j web3j = Web3j.build(new HttpService(crossbellConfig.getRpcUrl()));

    // 创建凭证
    Credentials credentials = Credentials.create(crossbellConfig.getPrivateKey());

    // 检查账户余额
    EthGetBalance ethGetBalance = web3j.ethGetBalance(credentials.getAddress(), DefaultBlockParameterName.LATEST)
        .send();
    BigInteger balance = ethGetBalance.getBalance();
    log.info("账户余额: {} wei", balance);

    // 使用更低的 Gas 价格
    BigInteger gasPrice = BigInteger.valueOf(1000000000L); // 1 Gwei
    BigInteger gasLimit = BigInteger.valueOf(1000000L); // 1M gas

    BigInteger estimatedCost = gasLimit.multiply(gasPrice);
    log.info("估算费用: {} wei (Gas: {}, 价格: {} wei)", estimatedCost, gasLimit, gasPrice);

    if (balance.compareTo(estimatedCost) < 0) {
      throw new RuntimeException("账户余额不足。需要: " + estimatedCost + " wei，当前余额: " + balance + " wei");
    }

    // 构建交易
    String functionName = "postNote";
    List<Type> inputParameters = Arrays.asList(
        new Uint256(new BigInteger(crossbellConfig.getCharacterId())),
        new org.web3j.abi.datatypes.Utf8String(noteContent),
        new Bytes32(new byte[32]) // 空的 linkModule
    );

    Function function = new Function(functionName, inputParameters, Arrays.asList(new TypeReference<Uint256>() {
    }));

    String encodedFunction = FunctionEncoder.encode(function);

    // 获取 nonce
    EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
        credentials.getAddress(), DefaultBlockParameterName.LATEST).send();

    BigInteger nonce = ethGetTransactionCount.getTransactionCount();

    // 构建交易
    RawTransaction rawTransaction = RawTransaction.createTransaction(
        nonce,
        gasPrice,
        gasLimit,
        crossbellConfig.getContractAddress(),
        encodedFunction);

    // 签名交易
    byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
    String hexValue = Numeric.toHexString(signedMessage);

    // 发送交易
    EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();

    if (ethSendTransaction.hasError()) {
      throw new RuntimeException("交易发送失败: " + ethSendTransaction.getError().getMessage());
    }

    String transactionHash = ethSendTransaction.getTransactionHash();
    log.info("交易已发送，哈希: {}", transactionHash);

    // 直接返回交易哈希，让上层方法处理 Note ID 查询
    return transactionHash;
  }

  /**
   * 通过智能合约发布 Note
   */
  private String publishViaSmartContract(String noteContent) throws Exception {
    log.info("尝试通过智能合约发布 Note");

    // 创建 Web3j 实例
    Web3j web3j = Web3j.build(new HttpService(crossbellConfig.getRpcUrl()));

    // 创建凭证
    Credentials credentials = Credentials.create(crossbellConfig.getPrivateKey());

    // 检查账户余额
    EthGetBalance ethGetBalance = web3j.ethGetBalance(credentials.getAddress(), DefaultBlockParameterName.LATEST)
        .send();
    BigInteger balance = ethGetBalance.getBalance();
    log.info("账户余额: {} wei", balance);

    // 估算 Gas 费用
    BigInteger estimatedGas = BigInteger.valueOf(crossbellConfig.getGasLimit());
    BigInteger estimatedGasPrice = BigInteger.valueOf(crossbellConfig.getGasPrice());
    BigInteger estimatedCost = estimatedGas.multiply(estimatedGasPrice);

    if (balance.compareTo(estimatedCost) < 0) {
      throw new RuntimeException("账户余额不足。需要: " + estimatedCost + " wei，当前余额: " + balance + " wei");
    }

    // 构建交易
    String functionName = "postNote";
    List<Type> inputParameters = Arrays.asList(
        new Uint256(new BigInteger(crossbellConfig.getCharacterId())),
        new org.web3j.abi.datatypes.Utf8String(noteContent),
        new Bytes32(new byte[32]) // 空的 linkModule
    );

    Function function = new Function(functionName, inputParameters, Arrays.asList(new TypeReference<Uint256>() {
    }));

    String encodedFunction = FunctionEncoder.encode(function);

    // 获取 nonce
    EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
        credentials.getAddress(), DefaultBlockParameterName.LATEST).send();

    BigInteger nonce = ethGetTransactionCount.getTransactionCount();

    // 获取当前 Gas 价格
    EthGasPrice ethGasPrice = web3j.ethGasPrice().send();
    BigInteger gasPrice = ethGasPrice.getGasPrice();

    // 使用动态 Gas 价格，但不超过配置的最大值
    BigInteger maxGasPrice = BigInteger.valueOf(crossbellConfig.getGasPrice());
    if (gasPrice.compareTo(maxGasPrice) > 0) {
      gasPrice = maxGasPrice;
    }

    log.info("使用 Gas 价格: {} wei", gasPrice);

    // 构建交易
    RawTransaction rawTransaction = RawTransaction.createTransaction(
        nonce,
        gasPrice,
        BigInteger.valueOf(crossbellConfig.getGasLimit()),
        crossbellConfig.getContractAddress(),
        encodedFunction);

    // 签名交易
    byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
    String hexValue = Numeric.toHexString(signedMessage);

    // 发送交易
    EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();

    if (ethSendTransaction.hasError()) {
      throw new RuntimeException("交易发送失败: " + ethSendTransaction.getError().getMessage());
    }

    String transactionHash = ethSendTransaction.getTransactionHash();
    log.info("交易已发送，哈希: {}", transactionHash);

    // 直接返回交易哈希，让上层方法处理 Note ID 查询
    return transactionHash;
  }

  /**
   * 更新数据库中的区块链信息
   */
  private void updateBlockchainInfo(Integer articleId, String txHash, String noteId) {
    try {
      log.info("更新文章 {} 的区块链信息: txHash={}, noteId={}", articleId, txHash, noteId);

      // 验证 Note ID 的唯一性
      if (!txHash.equals(noteId)) { // 如果不是交易哈希作为备用
        validateNoteIdUniqueness(articleId, noteId);
      }

      // 使用 ArticleCopyrightService 的现成方法
      boolean success = articleCopyrightService.updateBlockchainInfo(articleId, txHash, noteId);

      if (success) {
        log.info("成功更新文章 {} 的区块链信息", articleId);
      } else {
        log.warn("未找到文章 {} 的版权信息记录，尝试创建", articleId);

        // 如果没有版权记录，尝试创建一个基本的记录
        ArticleCopyright copyright = new ArticleCopyright();
        copyright.setArticleId(articleId);
        copyright.setBlockchainTxHash(txHash);
        copyright.setNoteId(noteId);
        copyright.setBlockchainContractAddress(crossbellConfig.getContractAddress());
        copyright.setCreatedAt(LocalDateTime.now());
        copyright.setUpdatedAt(LocalDateTime.now());

        articleCopyrightService.save(copyright);
        log.info("成功创建文章 {} 的版权信息记录", articleId);
      }
    } catch (Exception e) {
      log.error("更新区块链信息失败: {}", e.getMessage(), e);
    }
  }

  /**
   * 验证 Note ID 的唯一性
   */
  private void validateNoteIdUniqueness(Integer currentArticleId, String noteId) {
    try {
      // 查询数据库中是否已有相同的 Note ID
      List<ArticleCopyright> existingCopyrights = articleCopyrightService.getAllCopyrights();

      for (ArticleCopyright copyright : existingCopyrights) {
        if (copyright.getNoteId() != null &&
            copyright.getNoteId().equals(noteId) &&
            !copyright.getArticleId().equals(currentArticleId)) {

          log.warn("⚠️ 发现重复的 Note ID: {} 已被文章 {} 使用，当前文章: {}",
              noteId, copyright.getArticleId(), currentArticleId);

          // 获取 Note 的详细信息进行验证
          getNoteDetails(noteId);
          break;
        }
      }
    } catch (Exception e) {
      log.error("验证 Note ID 唯一性失败: {}", e.getMessage());
    }
  }

  /**
   * 获取 Note 的详细信息
   */
  private void getNoteDetails(String noteId) {
    try {
      String noteEndpoint = "https://indexer.crossbell.io/v1/notes/" + noteId;

      Request request = new Request.Builder()
          .url(noteEndpoint)
          .addHeader("Accept", "application/json")
          .addHeader("User-Agent", "Blog-Backend/1.0")
          .build();

      try (Response response = httpClient.newCall(request).execute()) {
        if (response.isSuccessful() && response.body() != null) {
          String responseBody = response.body().string();
          JsonNode note = objectMapper.readTree(responseBody);

          if (note.has("metadata") && note.get("metadata").has("content")) {
            String content = note.get("metadata").get("content").asText();
            log.info("Note {} 的内容: {}", noteId, content.substring(0, Math.min(100, content.length())) + "...");
          }

          if (note.has("transactionHash")) {
            String txHash = note.get("transactionHash").asText();
            log.info("Note {} 的交易哈希: {}", noteId, txHash);
          }

          if (note.has("createdAt")) {
            String createdAt = note.get("createdAt").asText();
            log.info("Note {} 的创建时间: {}", noteId, createdAt);
          }
        }
      }
    } catch (Exception e) {
      log.error("获取 Note 详细信息失败: {}", e.getMessage());
    }
  }

  /**
   * 等待交易确认并获取 Note ID
   */
  private String waitForTransactionAndGetNoteId(String txHash) {
    try {
      // 如果已经是 Note ID，直接返回
      if (txHash.startsWith("note-")) {
        return txHash;
      }

      // 如果是交易哈希，等待确认并查询
      if (txHash.startsWith("0x")) {
        log.info("等待交易确认: {}", txHash);

        // 等待交易确认
        Thread.sleep(5000); // 等待 5 秒

        // 查询交易收据
        Web3j web3j = Web3j.build(new HttpService(crossbellConfig.getRpcUrl()));
        EthGetTransactionReceipt receipt = web3j.ethGetTransactionReceipt(txHash).send();

        if (receipt.hasError()) {
          log.warn("查询交易收据失败: {}", receipt.getError().getMessage());
          return null;
        }

        TransactionReceipt transactionReceipt = receipt.getTransactionReceipt().orElse(null);
        if (transactionReceipt != null && transactionReceipt.isStatusOK()) {
          log.info("交易已确认: {}", txHash);

          // 通过 Crossbell Indexer API 查询 Note ID
          return queryNoteIdFromIndexer(txHash);
        } else if (transactionReceipt != null) {
          log.warn("交易失败: {}", txHash);
          return null;
        } else {
          log.warn("交易未确认，可能需要更多时间: {}", txHash);
          // 即使交易未确认，也尝试查询 Note ID
          return queryNoteIdFromIndexer(txHash);
        }
      }

      return txHash;
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      return null;
    } catch (Exception e) {
      log.error("等待交易确认失败: {}", e.getMessage());
      return null;
    }
  }

  /**
   * 通过 Crossbell Indexer API 查询 Note ID
   */
  private String queryNoteIdFromIndexer(String txHash) {
    try {
      log.info("通过 Indexer API 查询 Note ID: {}", txHash);

      // 优先查询您的 Character 的最新 Notes
      String characterEndpoint = "https://indexer.crossbell.io/v1/characters/" + crossbellConfig.getCharacterId()
          + "/notes?limit=10";

      try {
        Request request = new Request.Builder()
            .url(characterEndpoint)
            .addHeader("Accept", "application/json")
            .addHeader("User-Agent", "Blog-Backend/1.0")
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
          if (response.isSuccessful() && response.body() != null) {
            String responseBody = response.body().string();
            log.info("Character Notes API 响应状态: {}", response.code());

            JsonNode jsonNode = objectMapper.readTree(responseBody);

            // 检查是否有 notes 数组
            if (jsonNode.has("list") && jsonNode.get("list").isArray()) {
              JsonNode notesArray = jsonNode.get("list");

              // 遍历最新的 Notes，查找匹配的交易哈希
              for (JsonNode note : notesArray) {
                if (note.has("transactionHash") && note.has("noteId")) {
                  String noteTxHash = note.get("transactionHash").asText();
                  if (noteTxHash.equalsIgnoreCase(txHash)) {
                    String noteId = note.get("noteId").asText();
                    log.info("找到匹配的 Note ID: {} (交易哈希: {})", noteId, txHash);
                    return noteId;
                  }
                }
              }

              log.warn("在 Character 的 Notes 中未找到匹配的交易哈希: {}", txHash);
            }
          }
        }
      } catch (Exception e) {
        log.warn("Character Notes API 查询失败: {}", e.getMessage());
      }

      // 备用方案：通过交易哈希直接查询
      String txHashEndpoint = "https://indexer.crossbell.io/v1/notes?transactionHash=" + txHash;

      try {
        Request request = new Request.Builder()
            .url(txHashEndpoint)
            .addHeader("Accept", "application/json")
            .addHeader("User-Agent", "Blog-Backend/1.0")
            .build();

        try (Response response = httpClient.newCall(request).execute()) {
          if (response.isSuccessful() && response.body() != null) {
            String responseBody = response.body().string();
            log.info("交易哈希查询 API 响应状态: {}", response.code());

            JsonNode jsonNode = objectMapper.readTree(responseBody);

            // 检查是否有 notes 数组
            if (jsonNode.has("list") && jsonNode.get("list").isArray()) {
              JsonNode notesArray = jsonNode.get("list");
              if (notesArray.size() > 0) {
                JsonNode firstNote = notesArray.get(0);
                if (firstNote.has("noteId")) {
                  String noteId = firstNote.get("noteId").asText();
                  log.info("通过交易哈希找到 Note ID: {}", noteId);
                  return noteId;
                }
              }
            }

            // 检查单个 Note 的情况
            if (jsonNode.has("noteId")) {
              String noteId = jsonNode.get("noteId").asText();
              log.info("通过交易哈希找到单个 Note ID: {}", noteId);
              return noteId;
            }
          }
        }
      } catch (Exception e) {
        log.warn("交易哈希查询 API 失败: {}", e.getMessage());
      }

      log.warn("无法通过 Indexer API 找到 Note ID，使用交易哈希作为 Note ID");
      return txHash; // 如果找不到真实的 Note ID，使用交易哈希作为备用
    } catch (Exception e) {
      log.error("查询 Note ID 失败: {}", e.getMessage());
      return txHash; // 如果查询失败，使用交易哈希作为备用
    }
  }
}