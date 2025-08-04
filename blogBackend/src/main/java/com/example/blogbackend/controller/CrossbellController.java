package com.example.blogbackend.controller;

import com.example.blogbackend.dto.CrossbellPublishRequest;
import com.example.blogbackend.dto.CrossbellPublishResult;
import com.example.blogbackend.service.CrossbellService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Crossbell 区块链控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/crossbell")
@CrossOrigin(origins = "*")
public class CrossbellController {

  @Autowired
  private CrossbellService crossbellService;

  /**
   * 发布文章到 Crossbell 区块链
   */
  @PostMapping("/publish")
  public ResponseEntity<CrossbellPublishResult> publishArticle(
      @RequestBody CrossbellPublishRequest request) {

    log.info("收到发布请求: {}", request);

    // 验证请求参数
    if (request == null) {
      log.error("请求体为空");
      return ResponseEntity.badRequest()
          .body(CrossbellPublishResult.builder()
              .success(false)
              .errorMessage("请求体不能为空")
              .build());
    }

    if (request.getArticleId() == null) {
      log.error("文章ID为空");
      return ResponseEntity.badRequest()
          .body(CrossbellPublishResult.builder()
              .success(false)
              .errorMessage("文章ID不能为空")
              .build());
    }

    try {
      CrossbellPublishResult result = crossbellService.publishArticle(request);

      if (result.isSuccess()) {
        log.info("文章发布成功: {}, Note ID: {}", request.getArticleId(), result.getNoteId());
        return ResponseEntity.ok(result);
      } else {
        log.error("文章发布失败: {}, 错误: {}", request.getArticleId(), result.getErrorMessage());
        return ResponseEntity.badRequest().body(result);
      }
    } catch (Exception e) {
      log.error("发布文章时发生异常: {}", request.getArticleId(), e);
      return ResponseEntity.internalServerError()
          .body(CrossbellPublishResult.builder()
              .success(false)
              .errorMessage("服务器内部错误: " + e.getMessage())
              .build());
    }
  }

  /**
   * 验证文章是否已上链
   */
  @GetMapping("/verify/{noteId}")
  public ResponseEntity<Boolean> verifyArticle(@PathVariable String noteId) {
    log.info("验证文章上链状态: {}", noteId);

    try {
      boolean isOnChain = crossbellService.verifyArticleOnChain(noteId);
      return ResponseEntity.ok(isOnChain);
    } catch (Exception e) {
      log.error("验证文章上链状态失败: {}", noteId, e);
      return ResponseEntity.internalServerError().body(false);
    }
  }

  /**
   * 获取 Crossbell 链接
   */
  @GetMapping("/url/{noteId}")
  public ResponseEntity<String> getCrossbellUrl(@PathVariable String noteId) {
    try {
      String url = crossbellService.getCrossbellUrl(noteId);
      return ResponseEntity.ok(url);
    } catch (Exception e) {
      log.error("获取 Crossbell 链接失败: {}", noteId, e);
      return ResponseEntity.internalServerError().body("");
    }
  }

  /**
   * 获取交易状态
   */
  @GetMapping("/transaction/{txHash}")
  public ResponseEntity<String> getTransactionStatus(@PathVariable String txHash) {
    log.info("获取交易状态: {}", txHash);

    try {
      String status = crossbellService.getTransactionStatus(txHash);
      return ResponseEntity.ok(status);
    } catch (Exception e) {
      log.error("获取交易状态失败: {}", txHash, e);
      return ResponseEntity.internalServerError().body("ERROR");
    }
  }

  /**
   * 健康检查
   */
  @GetMapping("/health")
  public ResponseEntity<String> health() {
    return ResponseEntity.ok("Crossbell service is running");
  }

  /**
   * 查询 Character 信息
   */
  @GetMapping("/character/{address}")
  public ResponseEntity<String> getCharacterInfo(@PathVariable String address) {
    log.info("查询 Character 信息: {}", address);

    try {
      // 调用 Crossbell API 查询 Character
      String url = "https://indexer.crossbell.io/v1/characters?owner=" + address;
      Request request = new Request.Builder().url(url).build();

      try (Response response = new OkHttpClient().newCall(request).execute()) {
        if (response.isSuccessful() && response.body() != null) {
          String responseBody = response.body().string();
          log.info("Character 查询成功，状态码: {}", response.code());
          return ResponseEntity.ok(responseBody);
        } else {
          return ResponseEntity.badRequest().body("查询失败: " + response.code());
        }
      }
    } catch (Exception e) {
      log.error("查询 Character 信息失败: {}", address, e);
      return ResponseEntity.internalServerError().body("查询失败: " + e.getMessage());
    }
  }
}