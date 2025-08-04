package com.example.blogbackend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * Crossbell 发布请求 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrossbellPublishRequest {

  /**
   * 文章ID
   */
  private Integer articleId;

  /**
   * 许可协议类型
   */
  private String licenseType;

  /**
   * 版权持有者
   */
  private String copyrightHolder;

  /**
   * 作者
   */
  private String author;

  /**
   * 发布时间
   */
  private LocalDateTime publishTime;
}