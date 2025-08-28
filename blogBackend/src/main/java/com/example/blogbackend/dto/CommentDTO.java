package com.example.blogbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private Integer userId;
    private String articleTitle;
    private String username;
    private String avatar;
    private Integer parentId;
    private Integer articleId;

    /**
     * 网络运营商
     */
    private String networkOperator;

    /**
     * IP属地（省份/城市）
     */
    private String ipLocation;

    /**
     * 浏览器版本
     */
    private String browserVersion;

    /**
     * 操作系统
     */
    private String operatingSystem;
}