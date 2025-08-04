package com.example.blogbackend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Crossbell 发布结果 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossbellPublishResult {

  /**
   * 是否成功
   */
  private boolean success;

  /**
   * 交易哈希
   */
  private String transactionHash;

  /**
   * Note ID
   */
  private String noteId;

  /**
   * 错误信息
   */
  private String errorMessage;

  /**
   * 发布时间
   */
  private LocalDateTime publishTime;

  /**
   * Crossbell 链接
   */
  private String crossbellUrl;
}