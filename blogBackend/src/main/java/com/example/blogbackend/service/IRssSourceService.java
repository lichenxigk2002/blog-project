package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.RssSource;
import com.example.blogbackend.dto.RssFeedDTO;
import com.example.blogbackend.dto.RssArticleDTO;
import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-01-19
 */
public interface IRssSourceService extends IService<RssSource> {

  List<RssFeedDTO> getRssSourcesWithFriendLinks();

  boolean addRssSource(RssSource rssSource);

  boolean deleteRssSource(Integer id);

  List<RssArticleDTO> getRssArticles(int page, int size);

  int getRssArticlesCount();
}