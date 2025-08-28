package com.example.blogbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RssFeedDTO {
  private Integer sourceId;
  private Integer friendLinkId;
  private String friendName;
  private String friendUrl;
  private String friendAvatarUrl;
  private String friendDescription;
  private String rssUrl;
  private LocalDateTime createdAt;
}