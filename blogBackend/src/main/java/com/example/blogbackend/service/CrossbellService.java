package com.example.blogbackend.service;

import com.example.blogbackend.dto.CrossbellPublishRequest;
import com.example.blogbackend.dto.CrossbellPublishResult;

/**
 * Crossbell 服务接口
 */
public interface CrossbellService {

  /**
   * 发布文章到 Crossbell 区块链
   *
   * @param request 发布请求
   * @return 发布结果
   */
  CrossbellPublishResult publishArticle(CrossbellPublishRequest request);

  /**
   * 验证文章是否已上链
   *
   * @param noteId Note ID
   * @return 是否已上链
   */
  boolean verifyArticleOnChain(String noteId);

  /**
   * 获取 Crossbell 链接
   *
   * @param noteId Note ID
   * @return Crossbell 链接
   */
  String getCrossbellUrl(String noteId);

  /**
   * 获取交易状态
   *
   * @param txHash 交易哈希
   * @return 交易状态
   */
  String getTransactionStatus(String txHash);
}