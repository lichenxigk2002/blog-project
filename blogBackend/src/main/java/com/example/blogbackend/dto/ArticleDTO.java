package com.example.blogbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ArticleDTO {
    private Integer id;
    private String title;
    private String slug;
    private String content;
    private String htmlContent;
    private String excerpt;
    private String coverImage;
    private String images;
    private Integer authorId;
    private String status;
    private String postType;
    private String createdAt;
    private String updatedAt;
    private String publishedAt;
    private Integer viewCount;
    private Integer likeCount;
    private Integer readingTime;

    // 新增：标签ID列表
    private List<Integer> tagIds;

    // 新增：推送相关字段
    private Boolean shouldNotify; // 是否推送邮件
    private List<Long> notifyUserIds; // 推送给哪些用户ID

    // 新增：置顶和排序字段
    private Boolean isTop; // 是否置顶
    private Integer sortOrder; // 排序权重

    // 新增：AI摘要字段
    private String taobaoSummary;  // 桃宝风格摘要
    private String aiSummary;      // 豆包AI摘要

    // 新增：宵宫寄语字段
    private Boolean showYoimiyaLetter;
    private String yoimiyaLetterContent;

    // getter/setter 省略，可用 Lombok @Data
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // ... 其它字段 getter/setter ...
    public List<Integer> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Integer> tagIds) {
        this.tagIds = tagIds;
    }

    public Boolean getShouldNotify() {
        return shouldNotify;
    }

    public void setShouldNotify(Boolean shouldNotify) {
        this.shouldNotify = shouldNotify;
    }

    public List<Long> getNotifyUserIds() {
        return notifyUserIds;
    }

    public void setNotifyUserIds(List<Long> notifyUserIds) {
        this.notifyUserIds = notifyUserIds;
    }
}