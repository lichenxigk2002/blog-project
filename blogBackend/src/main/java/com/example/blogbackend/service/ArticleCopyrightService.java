package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.ArticleCopyright;

import java.util.List;

/**
 * <p>
 * 文章版权信息服务类
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
public interface ArticleCopyrightService extends IService<ArticleCopyright> {

  /**
   * 根据文章ID获取版权信息
   *
   * @param articleId 文章ID
   * @return 版权信息
   */
  ArticleCopyright getByArticleId(Integer articleId);

  /**
   * 创建或更新文章版权信息
   *
   * @param articleId       文章ID
   * @param licenseType     许可协议类型
   * @param copyrightHolder 版权持有者
   * @return 版权信息
   */
  ArticleCopyright createOrUpdateCopyright(Integer articleId, String licenseType, String copyrightHolder);

  /**
   * 更新IPFS哈希
   *
   * @param articleId 文章ID
   * @param ipfsHash  IPFS哈希
   * @return 是否成功
   */
  boolean updateIpfsHash(Integer articleId, String ipfsHash);

  /**
   * 更新区块链信息
   *
   * @param articleId 文章ID
   * @param txHash    交易哈希
   * @param noteId    Note ID
   * @return 是否成功
   */
  boolean updateBlockchainInfo(Integer articleId, String txHash, String noteId);

  /**
   * 获取所有版权信息
   *
   * @return 所有版权信息列表
   */
  List<ArticleCopyright> getAllCopyrights();
}