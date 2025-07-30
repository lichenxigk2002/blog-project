package com.example.blogbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import com.example.blogbackend.service.IArticlesService;
import com.example.blogbackend.entity.Articles;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * RSS订阅控制器
 */
@Controller
@RequestMapping("/rss")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class RssController {

  @Autowired
  private IArticlesService articlesService;

  /**
   * 生成RSS Feed
   */
  @GetMapping(value = "/feed", produces = "application/xml;charset=UTF-8")
  @ResponseBody
  public String generateRssFeed(HttpServletRequest request) {
    try {
      // 获取最新的文章列表
      List<Articles> articles = articlesService.lambdaQuery()
          .eq(Articles::getStatus, "published")
          .orderByDesc(Articles::getCreatedAt)
          .last("LIMIT 20")
          .list();

      // 使用固定的域名
      String baseUrl = "https://www.gfbzsblog.site";

      StringBuilder rss = new StringBuilder();
      rss.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
      rss.append("<rss version=\"2.0\"\n");
      rss.append("  xmlns:content=\"http://purl.org/rss/1.0/modules/content/\"\n");
      rss.append("  xmlns:wfw=\"http://wellformedweb.org/CommentAPI/\"\n");
      rss.append("  xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n");
      rss.append("  xmlns:atom=\"http://www.w3.org/2005/Atom\"\n");
      rss.append("  xmlns:sy=\"http://purl.org/rss/1.0/modules/syndication/\"\n");
      rss.append("  xmlns:slash=\"http://purl.org/rss/1.0/modules/slash/\"\n");
      rss.append(">\n");
      rss.append("\n");
      rss.append("<channel>\n");
      rss.append("  <title>孤芳不自赏的博客</title>\n");
      rss.append("  <atom:link href=\"").append(baseUrl)
          .append("/rss/feed\" rel=\"self\" type=\"application/rss+xml\" />\n");
      rss.append("  <link>").append(baseUrl).append("</link>\n");
      rss.append("  <description>分享技术心得，记录生活感悟</description>\n");
      rss.append("  <lastBuildDate>").append(formatRssDate(new Date())).append("</lastBuildDate>\n");
      rss.append("  <language>zh-CN</language>\n");
      rss.append("  <sy:updatePeriod>hourly</sy:updatePeriod>\n");
      rss.append("  <sy:updateFrequency>1</sy:updateFrequency>\n");
      rss.append("  <generator>https://www.gfbzsblog.site</generator>\n");
      rss.append("\n");

      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

      for (Articles article : articles) {
        rss.append("  <item>\n");
        rss.append("    <title>").append(escapeXml(article.getTitle())).append("</title>\n");
        rss.append("    <link>").append(baseUrl).append("/articles/").append(article.getId()).append("</link>\n");
        rss.append("    <comments>").append(baseUrl).append("/articles/").append(article.getId())
            .append("#comments</comments>\n");
        rss.append("    <dc:creator><![CDATA[孤芳不自赏]]></dc:creator>\n");
        rss.append("    <pubDate>")
            .append(formatRssDate(Date.from(article.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant())))
            .append("</pubDate>\n");
        rss.append("    <category><![CDATA[技术博客]]></category>\n");
        rss.append("    <guid isPermaLink=\"false\">").append(baseUrl).append("/articles/").append(article.getId())
            .append("</guid>\n");
        rss.append("\n");
        rss.append("    <description><![CDATA[")
            .append(article.getExcerpt() != null ? article.getExcerpt() : article.getContent())
            .append("]]></description>\n");
        rss.append("    <content:encoded><![CDATA[").append(article.getContent()).append("]]></content:encoded>\n");
        rss.append("    <wfw:commentRss>").append(baseUrl).append("/rss/feed</wfw:commentRss>\n");
        rss.append("  </item>\n");
      }

      rss.append("\n");
      rss.append("</channel>\n");
      rss.append("</rss>");

      return rss.toString();
    } catch (Exception e) {
      return "<?xml version=\"1.0\" encoding=\"UTF-8\"?><rss version=\"2.0\"><channel><title>Error</title></channel></rss>";
    }
  }

  /**
   * RSS订阅页面
   */
  @GetMapping("/subscribe")
  public String rssSubscribePage(Model model) {
    model.addAttribute("title", "RSS订阅");
    return "rssSubscribe";
  }

  /**
   * 获取RSS订阅信息
   */
  @GetMapping("/info")
  @ResponseBody
  public Map<String, Object> getRssInfo(HttpServletRequest request) {
    // 使用固定的域名，而不是动态获取
    String baseUrl = "https://www.gfbzsblog.site";

    Map<String, Object> info = new HashMap<>();
    info.put("feedUrl", baseUrl + "/rss/feed");
    info.put("title", "孤芳不自赏的博客");
    info.put("description", "分享技术心得，记录生活感悟");
    info.put("language", "zh-CN");

    return info;
  }

  /**
   * 格式化RSS日期
   */
  private String formatRssDate(Date date) {
    SimpleDateFormat sdf = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);
    return sdf.format(date);
  }

  /**
   * 转义XML特殊字符
   */
  private String escapeXml(String text) {
    if (text == null)
      return "";
    return text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&apos;");
  }
}