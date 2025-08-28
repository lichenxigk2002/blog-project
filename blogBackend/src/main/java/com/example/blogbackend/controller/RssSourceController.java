package com.example.blogbackend.controller;

import com.example.blogbackend.entity.RssSource;
import com.example.blogbackend.dto.RssFeedDTO;
import com.example.blogbackend.dto.RssArticleDTO;
import com.example.blogbackend.service.IRssSourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-01-19
 */
@RestController
@RequestMapping("/rss")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class RssSourceController {

  @Autowired
  private IRssSourceService rssSourceService;

  /**
   * 获取所有RSS源（包含友链信息）
   */
  @GetMapping("/sources")
  public ResponseEntity<List<RssFeedDTO>> getRssSources() {
    List<RssFeedDTO> sources = rssSourceService.getRssSourcesWithFriendLinks();
    return ResponseEntity.ok(sources);
  }

  /**
   * 添加RSS源
   */
  @PostMapping("/sources")
  public ResponseEntity<RssSource> create(@RequestBody RssSource rssSource) {
    rssSourceService.addRssSource(rssSource);
    return ResponseEntity.ok(rssSource);
  }

  /**
   * 删除RSS源
   */
  @DeleteMapping("/sources/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) {
    rssSourceService.deleteRssSource(id);
    return ResponseEntity.ok().build();
  }

  /**
   * 获取RSS文章（支持分页）
   */
  @GetMapping("/articles")
  public ResponseEntity<List<RssArticleDTO>> getRssArticles(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "20") int size) {
    List<RssArticleDTO> articles = rssSourceService.getRssArticles(page, size);
    return ResponseEntity.ok(articles);
  }

  /**
   * 获取RSS文章总数
   */
  @GetMapping("/articles/count")
  public ResponseEntity<Map<String, Object>> getRssArticlesCount() {
    int totalCount = rssSourceService.getRssArticlesCount();
    Map<String, Object> response = new HashMap<>();
    response.put("totalCount", totalCount);
    return ResponseEntity.ok(response);
  }
}