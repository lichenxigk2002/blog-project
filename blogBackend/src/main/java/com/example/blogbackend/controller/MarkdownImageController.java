package com.example.blogbackend.controller;

import com.example.blogbackend.config.CosConfig;
import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/markdownImage")
public class MarkdownImageController {
  @Autowired
  private COSClient cosClient;

  @Autowired
  private CosConfig cosConfig;

  @PostMapping("/upload")
  public ResponseEntity<Map<String, String>> uploadMarkdownImage(@RequestParam("file") MultipartFile file) {
    try {
      String originalFilename = file.getOriginalFilename();
      String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
      String key = "images/" + UUID.randomUUID() + suffix;

      cosClient.putObject(new PutObjectRequest(
          cosConfig.getBucketName(),
          key,
          file.getInputStream(),
          null));

      String url = cosConfig.getUrl() + "/" + key;

      Map<String, String> response = new HashMap<>();
      response.put("url", url);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      e.printStackTrace();
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "上传失败");
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }
}