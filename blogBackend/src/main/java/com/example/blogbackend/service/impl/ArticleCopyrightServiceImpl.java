package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.ArticleCopyright;
import com.example.blogbackend.mapper.ArticleCopyrightMapper;
import com.example.blogbackend.service.ArticleCopyrightService;
import com.example.blogbackend.dto.CrossbellPublishRequest;
import com.example.blogbackend.dto.CrossbellPublishResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 文章版权信息服务实现类
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Service
public class ArticleCopyrightServiceImpl extends ServiceImpl<ArticleCopyrightMapper, ArticleCopyright>
    implements ArticleCopyrightService {

  // 移除循环依赖
  // @Autowired
  // private CrossbellService crossbellService;

  @Override
  public ArticleCopyright getByArticleId(Integer articleId) {
    return baseMapper.selectByArticleId(articleId);
  }

  @Override
  public ArticleCopyright createOrUpdateCopyright(Integer articleId, String licenseType, String copyrightHolder) {
    // 查询是否已存在版权信息
    ArticleCopyright existingCopyright = getByArticleId(articleId);

    if (existingCopyright != null) {
      // 更新现有版权信息
      existingCopyright.setLicenseType(licenseType);
      existingCopyright.setCopyrightHolder(copyrightHolder);
      existingCopyright.setUpdatedAt(LocalDateTime.now());
      updateById(existingCopyright);
      return existingCopyright;
    } else {
      // 创建新的版权信息
      ArticleCopyright newCopyright = new ArticleCopyright();
      newCopyright.setArticleId(articleId);
      newCopyright.setLicenseType(licenseType);
      newCopyright.setCopyrightHolder(copyrightHolder);
      newCopyright.setCreatedAt(LocalDateTime.now());
      newCopyright.setUpdatedAt(LocalDateTime.now());
      save(newCopyright);
      return newCopyright;
    }
  }

  @Override
  public boolean updateIpfsHash(Integer articleId, String ipfsHash) {
    QueryWrapper<ArticleCopyright> wrapper = new QueryWrapper<>();
    wrapper.eq("article_id", articleId);

    ArticleCopyright copyright = getOne(wrapper);
    if (copyright != null) {
      copyright.setIpfsHash(ipfsHash);
      copyright.setUpdatedAt(LocalDateTime.now());
      return updateById(copyright);
    }
    return false;
  }

  @Override
  public boolean updateBlockchainInfo(Integer articleId, String txHash, String noteId) {
    QueryWrapper<ArticleCopyright> wrapper = new QueryWrapper<>();
    wrapper.eq("article_id", articleId);

    ArticleCopyright copyright = getOne(wrapper);
    if (copyright != null) {
      copyright.setBlockchainTxHash(txHash);
      copyright.setNoteId(noteId);
      copyright.setUpdatedAt(LocalDateTime.now());
      return updateById(copyright);
    }
    return false;
  }

  @Override
  public List<ArticleCopyright> getAllCopyrights() {
    return baseMapper.selectAllWithArticleInfo();
  }

  @Override
  public CrossbellPublishResult publishToCrossbell(CrossbellPublishRequest request) {
    // 这个方法现在由 CrossbellService 直接处理
    throw new UnsupportedOperationException("请直接使用 CrossbellService.publishArticle() 方法");
  }

  @Override
  public boolean verifyArticleOnCrossbell(Integer articleId) {
    // 获取文章的 noteId
    ArticleCopyright copyright = getByArticleId(articleId);
    if (copyright != null && copyright.getNoteId() != null) {
      // 这里应该调用 CrossbellService，但为了避免循环依赖，暂时返回 false
      // 建议直接使用 CrossbellService.verifyArticleOnChain()
      return false;
    }
    return false;
  }

  @Override
  public String getCrossbellUrl(Integer articleId) {
    // 获取文章的 noteId
    ArticleCopyright copyright = getByArticleId(articleId);
    if (copyright != null && copyright.getNoteId() != null) {
      // 这里应该调用 CrossbellService，但为了避免循环依赖，暂时返回 null
      // 建议直接使用 CrossbellService.getCrossbellUrl()
      return null;
    }
    return null;
  }
}