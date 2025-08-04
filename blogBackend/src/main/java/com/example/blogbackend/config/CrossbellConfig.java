package com.example.blogbackend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Crossbell 配置类
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "crossbell")
public class CrossbellConfig {

  /**
   * Crossbell RPC URL
   */
  private String rpcUrl = "https://rpc.crossbell.io";

  /**
   * 私钥（用于签名交易）
   */
  private String privateKey;

  /**
   * 合约地址
   */
  private String contractAddress = "0xa6f969045641Cf486d747E9Ef0C56C3C14aC5e99";

  /**
   * 网络 ID
   */
  private Integer chainId = 3737;

  /**
   * Gas 限制
   */
  private Long gasLimit = 3000000L;

  /**
   * Gas 价格（wei）
   */
  private Long gasPrice = 20000000000L; // 20 Gwei

  /**
   * 是否启用 Crossbell 功能
   */
  private Boolean enabled = true;

  /**
   * 重试次数
   */
  private Integer retryCount = 3;

  /**
   * 确认超时时间（秒）
   */
  private Integer confirmationTimeout = 30;

  /**
   * Character ID（Crossbell 用户标识）
   */
  private String characterId;
}