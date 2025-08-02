package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.util.List;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 博客文章表
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("articles")
public class Articles implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 文章ID，自增主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 文章标题
     */
    private String title;

    /**
     * 文章URL友好名称（用于SEO）
     */
    private String slug;

    /**
     * Markdown格式的原始内容
     */
    private String content;

    /**
     * 转换后的HTML内容（可选）
     */
    private String htmlContent;

    /**
     * 文章摘要（可自动生成或手动编写）
     */
    private String excerpt;

    /**
     * 封面图URL
     */
    private String coverImage;

    /**
     * 文章内使用的所有图片路径数组
     */
    private String images;

    /**
     * 作者ID（可以先存用户名字符串，后期关联用户表）
     */
    private Integer authorId;

    /**
     * 文章状态
     */
    private String status;

    /**
     * 文章类型
     */
    private String postType;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

    /**
     * 发布时间
     */
    private LocalDateTime publishedAt;

    /**
     * 浏览量
     */
    private Integer viewCount;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 预计阅读时长（分钟）
     */
    private Integer readingTime;

    /**
     * 是否置顶：0-否，1-是
     */
    private Boolean isTop;

    /**
     * 排序权重，数值越大越靠前
     */
    private Integer sortOrder;

    @TableField(exist = false)
    private List<Tags> tags; // 新增
}
