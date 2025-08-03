package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.ArticleCopyright;
import com.example.blogbackend.mapper.ArticleCopyrightMapper;
import com.example.blogbackend.service.ArticleCopyrightService;
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
}