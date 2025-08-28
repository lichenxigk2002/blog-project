package com.example.blogbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RssArticleDTO {
  private String title;
  private String link;
  private String description;
  private LocalDateTime pubDate;
  private String author;
  private String sourceName;
  private String sourceUrl;
  private String sourceAvatarUrl;
}