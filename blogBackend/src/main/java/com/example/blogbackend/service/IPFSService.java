package com.example.blogbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * IPFS服务 - 用于将文章内容上传到IPFS
 */
@Service
public class IPFSService {

  @Value("${ipfs.api.url:http://localhost:5001}")
  private String ipfsApiUrl;

  @Value("${ipfs.gateway.url:https://ipfs.io/ipfs/}")
  private String ipfsGatewayUrl;

  private final HttpClient httpClient = HttpClient.newHttpClient();
  private final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * 上传文章内容到IPFS
   * 
   * @param content 文章内容
   * @return IPFS哈希
   */
  public String uploadArticleContent(String content) throws IOException, InterruptedException {
    // 构建文章元数据
    Map<String, Object> articleMetadata = new HashMap<>();
    articleMetadata.put("content", content);
    articleMetadata.put("timestamp", System.currentTimeMillis());
    articleMetadata.put("version", "1.0");

    String jsonContent = objectMapper.writeValueAsString(articleMetadata);

    // 构建multipart请求
    String boundary = "----WebKitFormBoundary" + System.currentTimeMillis();
    String multipartBody = buildMultipartBody(jsonContent, boundary);

    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(ipfsApiUrl + "/api/v0/add"))
        .header("Content-Type", "multipart/form-data; boundary=" + boundary)
        .POST(HttpRequest.BodyPublishers.ofString(multipartBody, StandardCharsets.UTF_8))
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() == 200) {
      // 解析IPFS响应
      String[] lines = response.body().split("\n");
      for (String line : lines) {
        if (line.contains("\"Hash\"")) {
          String hash = line.split("\"Hash\":\"")[1].split("\"")[0];
          return hash;
        }
      }
    }

    throw new RuntimeException("Failed to upload to IPFS: " + response.statusCode() + " - " + response.body());
  }

  /**
   * 从IPFS获取文章内容
   * 
   * @param ipfsHash IPFS哈希
   * @return 文章内容
   */
  public String getArticleContent(String ipfsHash) throws IOException, InterruptedException {
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(ipfsApiUrl + "/api/v0/cat?arg=" + ipfsHash))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() == 200) {
      return response.body();
    }

    throw new RuntimeException("Failed to get content from IPFS: " + response.statusCode());
  }

  /**
   * 获取IPFS网关URL
   * 
   * @param ipfsHash IPFS哈希
   * @return 网关URL
   */
  public String getGatewayUrl(String ipfsHash) {
    return ipfsGatewayUrl + ipfsHash;
  }

  /**
   * 验证IPFS哈希是否有效
   * 
   * @param ipfsHash IPFS哈希
   * @return 是否有效
   */
  public boolean isValidHash(String ipfsHash) {
    return ipfsHash != null && ipfsHash.length() == 46 && ipfsHash.startsWith("Qm");
  }

  /**
   * 构建multipart请求体
   */
  private String buildMultipartBody(String content, String boundary) {
    StringBuilder body = new StringBuilder();
    body.append("--").append(boundary).append("\r\n");
    body.append("Content-Disposition: form-data; name=\"file\"; filename=\"article.json\"\r\n");
    body.append("Content-Type: application/json\r\n\r\n");
    body.append(content).append("\r\n");
    body.append("--").append(boundary).append("--\r\n");
    return body.toString();
  }

  /**
   * 上传文件到IPFS
   * 
   * @param file 文件
   * @return IPFS哈希
   */
  public String uploadFile(MultipartFile file) throws IOException, InterruptedException {
    // 这里可以实现文件上传逻辑
    // 为了简化，暂时返回null
    throw new UnsupportedOperationException("File upload not implemented yet");
  }
}