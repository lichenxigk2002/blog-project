package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.RssSource;
import com.example.blogbackend.dto.RssFeedDTO;
import com.example.blogbackend.dto.RssArticleDTO;
import com.example.blogbackend.mapper.RssSourceMapper;
import com.example.blogbackend.service.IRssSourceService;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-01-19
 */
@Service
public class RssSourceServiceImpl extends ServiceImpl<RssSourceMapper, RssSource> implements IRssSourceService {

  @Override
  public List<RssFeedDTO> getRssSourcesWithFriendLinks() {
    return baseMapper.getRssSourcesWithFriendLinks();
  }

  @Override
  public boolean addRssSource(RssSource rssSource) {
    rssSource.setCreatedAt(LocalDateTime.now());
    rssSource.setUpdatedAt(LocalDateTime.now());
    rssSource.setIsActive(true);
    return save(rssSource);
  }

  @Override
  public boolean deleteRssSource(Integer id) {
    return removeById(id);
  }

  @Override
  public List<RssArticleDTO> getRssArticles(int page, int size) {
    List<RssArticleDTO> allArticles = new ArrayList<>();
    List<RssFeedDTO> sources = getRssSourcesWithFriendLinks();

    // 随机化RSS源顺序，避免总是按照固定顺序处理
    List<RssFeedDTO> shuffledSources = new ArrayList<>(sources);
    Collections.shuffle(shuffledSources);

    // 先收集所有RSS源的文章
    for (RssFeedDTO source : shuffledSources) {
      try {
        List<RssArticleDTO> sourceArticles = parseRssFeed(source);
        allArticles.addAll(sourceArticles);
      } catch (Exception e) {
        // 记录日志，继续处理其他RSS源
        System.err.println("解析RSS失败: " + source.getRssUrl() + ", 错误: " + e.getMessage());
      }
    }

    // 按发布时间排序，最新的在前面
    allArticles.sort((a, b) -> {
      if (a.getPubDate() == null && b.getPubDate() == null) {
        return 0;
      }
      if (a.getPubDate() == null) {
        return 1; // null值排在后面
      }
      if (b.getPubDate() == null) {
        return -1; // null值排在后面
      }
      return b.getPubDate().compareTo(a.getPubDate()); // 降序：最新的在前面
    });

    // 分页处理
    int startIndex = (page - 1) * size;
    int endIndex = Math.min(startIndex + size, allArticles.size());

    // 如果起始索引超出范围，返回空列表
    if (startIndex >= allArticles.size()) {
      return new ArrayList<>();
    }

    return allArticles.subList(startIndex, endIndex);
  }

  @Override
  public int getRssArticlesCount() {
    List<RssArticleDTO> allArticles = new ArrayList<>();
    List<RssFeedDTO> sources = getRssSourcesWithFriendLinks();

    // 收集所有RSS源的文章
    for (RssFeedDTO source : sources) {
      try {
        List<RssArticleDTO> sourceArticles = parseRssFeed(source);
        allArticles.addAll(sourceArticles);
      } catch (Exception e) {
        // 记录日志，继续处理其他RSS源
        System.err.println("解析RSS失败: " + source.getRssUrl() + ", 错误: " + e.getMessage());
      }
    }

    return allArticles.size();
  }

  private List<RssArticleDTO> parseRssFeed(RssFeedDTO source) throws Exception {
    List<RssArticleDTO> articles = new ArrayList<>();

    URL url = new URL(source.getRssUrl());
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setRequestMethod("GET");
    connection.setConnectTimeout(10000);
    connection.setReadTimeout(10000);
    connection.setRequestProperty("User-Agent", "Mozilla/5.0 (compatible; RSS Reader)");

    try (BufferedReader reader = new BufferedReader(
        new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {

      SyndFeedInput input = new SyndFeedInput();
      SyndFeed feed = input.build(new XmlReader(connection.getInputStream()));

      feed.getEntries().forEach(entry -> {
        RssArticleDTO article = new RssArticleDTO();
        article.setTitle(entry.getTitle());
        article.setLink(entry.getLink());
        article.setDescription(entry.getDescription() != null ? entry.getDescription().getValue() : "");
        article.setPubDate(entry.getPublishedDate() != null
            ? entry.getPublishedDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime()
            : LocalDateTime.now());
        article.setAuthor(entry.getAuthor());
        article.setSourceName(source.getFriendName());
        article.setSourceUrl(source.getFriendUrl());
        article.setSourceAvatarUrl(source.getFriendAvatarUrl());

        articles.add(article);
      });
    } finally {
      connection.disconnect();
    }

    return articles;
  }
}