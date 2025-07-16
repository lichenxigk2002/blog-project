package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.service.IArticlesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.blogbackend.dto.ArticleDTO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/articles")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class ArticlesController {
    private static final Logger logger = LoggerFactory.getLogger(ArticlesController.class);
    private final IArticlesService iarticlesService;

    @Autowired
    private com.example.blogbackend.service.ISubscribeEmailsService subscribeEmailsService;
    @Autowired
    private com.example.blogbackend.utils.EmailUtil emailUtil;

    public ArticlesController(IArticlesService iarticlesService) {
        this.iarticlesService = iarticlesService;
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getArticles(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        logger.info("Getting articles with page={}, pageSize={}", page, pageSize);

        Page<Articles> articlesPage = iarticlesService.listWithTags(page, pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("data", articlesPage.getRecords());
        response.put("total", articlesPage.getTotal());
        response.put("page", page);
        response.put("pageSize", pageSize);

        logger.info("Response data: {}", response);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestBody ArticleDTO articleDTO, HttpServletRequest request) {
        // 1. 保存文章和标签关联
        Articles article = iarticlesService.saveArticleWithTags(articleDTO);

        // 2. 选择性推送邮件通知
        if (Boolean.TRUE.equals(articleDTO.getShouldNotify())) {
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();

            // 根据选择的用户ID获取订阅用户
            List<com.example.blogbackend.entity.SubscribeEmails> subscribers;
            if (articleDTO.getNotifyUserIds() != null && !articleDTO.getNotifyUserIds().isEmpty()) {
                // 推送给指定用户
                subscribers = subscribeEmailsService
                        .lambdaQuery()
                        .in(com.example.blogbackend.entity.SubscribeEmails::getId, articleDTO.getNotifyUserIds())
                        .eq(com.example.blogbackend.entity.SubscribeEmails::getSubscribed, true)
                        .list();
            } else {
                // 推送给所有订阅用户
                subscribers = subscribeEmailsService
                        .lambdaQuery()
                        .eq(com.example.blogbackend.entity.SubscribeEmails::getSubscribed, true)
                        .list();
            }

            // 发送邮件通知
            for (com.example.blogbackend.entity.SubscribeEmails sub : subscribers) {
                String unsubscribeToken = sub.getUnsubscribeToken();
                emailUtil.sendArticleNotifyMail(
                        sub.getEmail(),
                        sub.getName(),
                        article.getTitle(),
                        article.getExcerpt(), // 摘要
                        article.getId().toString(),
                        unsubscribeToken);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(article);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Articles> getArticleById(
            @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "false") boolean like) {
        Articles article = iarticlesService.getById(id);
        if (article == null) {
            return ResponseEntity.notFound().build();
        }

        // 如果需要点赞，增加点赞数
        if (like) {
            article.setLikeCount(article.getLikeCount() + 1);
            iarticlesService.updateById(article);
        }

        return ResponseEntity.ok(article);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(
            @PathVariable Integer id,
            @RequestBody ArticleDTO articleDTO) {
        articleDTO.setId(id);
        boolean success = iarticlesService.updateArticleWithTags(articleDTO);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Integer id) {
        boolean success = iarticlesService.removeById(id);
        if (!success) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Articles> likeArticle(@PathVariable Integer id) {
        try {
            Integer newLikeCount = iarticlesService.likeArticle(id);
            Articles article = iarticlesService.getById(id);
            return ResponseEntity.ok(article);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Articles> incrementViewCount(@PathVariable Integer id) {
        try {
            Articles article = iarticlesService.getById(id);
            if (article == null) {
                return ResponseEntity.notFound().build();
            }

            article.setViewCount(article.getViewCount() + 1);
            iarticlesService.updateById(article);

            return ResponseEntity.ok(article);
        } catch (Exception e) {
            logger.error("Error incrementing view count for article {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}