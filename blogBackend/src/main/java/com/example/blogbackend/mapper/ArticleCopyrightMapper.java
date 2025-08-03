package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.entity.ArticleCopyright;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 * 文章版权信息 Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Mapper
public interface ArticleCopyrightMapper extends BaseMapper<ArticleCopyright> {

  /**
   * 根据文章ID查询版权信息
   *
   * @param articleId 文章ID
   * @return 版权信息
   */
  @Select("SELECT * FROM article_copyrights WHERE article_id = #{articleId}")
  ArticleCopyright selectByArticleId(@Param("articleId") Integer articleId);

  /**
   * 查询所有版权信息（包含文章信息）
   *
   * @return 版权信息列表
   */
  @Select("SELECT ac.*, a.title, a.content FROM article_copyrights ac " +
      "LEFT JOIN articles a ON ac.article_id = a.id " +
      "ORDER BY ac.created_at DESC")
  List<ArticleCopyright> selectAllWithArticleInfo();
}