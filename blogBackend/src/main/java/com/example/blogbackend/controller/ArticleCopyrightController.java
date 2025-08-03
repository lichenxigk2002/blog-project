package com.example.blogbackend.controller;

import com.example.blogbackend.entity.ArticleCopyright;
import com.example.blogbackend.service.ArticleCopyrightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 文章版权信息控制器
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@RestController
@RequestMapping("/api/copyright")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class ArticleCopyrightController {

  @Autowired
  private ArticleCopyrightService articleCopyrightService;

  /**
   * 根据文章ID获取版权信息
   *
   * @param articleId 文章ID
   * @return 版权信息
   */
  @GetMapping("/article/{articleId}")
  public ResponseEntity<ArticleCopyright> getByArticleId(@PathVariable Integer articleId) {
    try {
      ArticleCopyright copyright = articleCopyrightService.getByArticleId(articleId);
      if (copyright != null) {
        return ResponseEntity.ok(copyright);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  /**
   * 创建或更新文章版权信息
   *
   * @param articleId   文章ID
   * @param requestBody 请求体
   * @return 版权信息
   */
  @PostMapping("/article/{articleId}")
  public ResponseEntity<ArticleCopyright> createOrUpdateCopyright(
      @PathVariable Integer articleId,
      @RequestBody Map<String, String> requestBody) {
    try {
      String licenseType = requestBody.get("licenseType");
      String copyrightHolder = requestBody.get("copyrightHolder");

      if (licenseType == null || copyrightHolder == null) {
        return ResponseEntity.badRequest().build();
      }

      ArticleCopyright copyright = articleCopyrightService.createOrUpdateCopyright(
          articleId, licenseType, copyrightHolder);
      return ResponseEntity.ok(copyright);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  /**
   * 更新IPFS哈希
   *
   * @param articleId 文章ID
   * @param ipfsHash  IPFS哈希
   * @return 操作结果
   */
  @PutMapping("/article/{articleId}/ipfs")
  public ResponseEntity<Map<String, Object>> updateIpfsHash(
      @PathVariable Integer articleId,
      @RequestParam String ipfsHash) {
    try {
      boolean success = articleCopyrightService.updateIpfsHash(articleId, ipfsHash);
      Map<String, Object> response = new HashMap<>();
      if (success) {
        response.put("message", "IPFS哈希更新成功");
        return ResponseEntity.ok(response);
      } else {
        response.put("message", "IPFS哈希更新失败");
        return ResponseEntity.badRequest().body(response);
      }
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();
      response.put("message", "更新IPFS哈希失败: " + e.getMessage());
      return ResponseEntity.internalServerError().body(response);
    }
  }

  /**
   * 更新区块链信息
   *
   * @param articleId 文章ID
   * @param txHash    交易哈希
   * @param noteId    Note ID
   * @return 操作结果
   */
  @PutMapping("/article/{articleId}/blockchain")
  public ResponseEntity<Map<String, Object>> updateBlockchainInfo(
      @PathVariable Integer articleId,
      @RequestParam String txHash,
      @RequestParam String noteId) {
    try {
      boolean success = articleCopyrightService.updateBlockchainInfo(articleId, txHash, noteId);
      Map<String, Object> response = new HashMap<>();
      if (success) {
        response.put("message", "区块链信息更新成功");
        return ResponseEntity.ok(response);
      } else {
        response.put("message", "区块链信息更新失败");
        return ResponseEntity.badRequest().body(response);
      }
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();
      response.put("message", "更新区块链信息失败: " + e.getMessage());
      return ResponseEntity.internalServerError().body(response);
    }
  }

  /**
   * 获取所有版权信息
   *
   * @return 所有版权信息列表
   */
  @GetMapping("/all")
  public ResponseEntity<List<ArticleCopyright>> getAllCopyrights() {
    try {
      List<ArticleCopyright> copyrights = articleCopyrightService.getAllCopyrights();
      return ResponseEntity.ok(copyrights);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }
}