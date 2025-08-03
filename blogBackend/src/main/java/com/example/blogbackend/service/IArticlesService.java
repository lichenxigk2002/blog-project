package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Articles;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.dto.ArticleDTO;

import java.util.List;
import java.util.Map;

/**
 * <p>
 * 博客文章表 服务类
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
public interface IArticlesService extends IService<Articles> {

    Page<Articles> listWithTags(int page, int pageSize);

    Articles saveArticleWithTags(ArticleDTO dto);

    boolean updateArticleWithTags(ArticleDTO dto);

    boolean removeById(Integer id);

    Integer likeArticle(Integer id);

    /**
     * 切换文章置顶状态
     */
    boolean toggleTop(Integer id);

    /**
     * 批量更新文章排序
     */
    boolean batchUpdateSort(List<Map<String, Object>> sortData);

    /**
     * 根据ID获取文章（包含版权信息）
     */
    Articles getArticleWithCopyright(Integer id);
}
