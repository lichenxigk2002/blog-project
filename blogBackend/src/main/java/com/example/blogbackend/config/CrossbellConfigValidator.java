package com.example.blogbackend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Crossbell 配置验证器
 */
@Slf4j
@Component
public class CrossbellConfigValidator implements CommandLineRunner {

  @Autowired
  private CrossbellConfig crossbellConfig;

  @Override
  public void run(String... args) throws Exception {
    validateCrossbellConfig();
  }

  private void validateCrossbellConfig() {
    log.info("验证 Crossbell 配置...");

    if (!crossbellConfig.getEnabled()) {
      log.warn("Crossbell 功能已禁用");
      return;
    }

    // 检查必要配置
    if (crossbellConfig.getPrivateKey() == null ||
        crossbellConfig.getPrivateKey().equals("your_private_key_here")) {
      log.error("❌ Crossbell 私钥未配置！请在环境变量中设置 CROSSBELL_PRIVATE_KEY");
      log.error("获取私钥步骤：");
      log.error("1. 安装 Crossbell 钱包");
      log.error("2. 创建账户");
      log.error("3. 导出私钥");
      log.error("4. 设置环境变量: CROSSBELL_PRIVATE_KEY=your_actual_private_key");
    } else {
      log.info("✅ Crossbell 私钥已配置");
    }

    if (crossbellConfig.getRpcUrl() == null || crossbellConfig.getRpcUrl().isEmpty()) {
      log.error("❌ Crossbell RPC URL 未配置");
    } else {
      log.info("✅ Crossbell RPC URL: {}", crossbellConfig.getRpcUrl());
    }

    log.info("✅ Crossbell 配置验证完成");
    log.info("📋 配置摘要:");
    log.info("   - 网络 ID: {}", crossbellConfig.getChainId());
    log.info("   - 合约地址: {}", crossbellConfig.getContractAddress());
    log.info("   - Gas 限制: {}", crossbellConfig.getGasLimit());
    log.info("   - Gas 价格: {} wei", crossbellConfig.getGasPrice());
    log.info("   - 重试次数: {}", crossbellConfig.getRetryCount());
    log.info("   - 确认超时: {} 秒", crossbellConfig.getConfirmationTimeout());
  }
}