package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.entity.RssSource;
import com.example.blogbackend.dto.RssFeedDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-01-19
 */
@Mapper
public interface RssSourceMapper extends BaseMapper<RssSource> {

  @Select("SELECT " +
      "rs.id as sourceId, " +
      "rs.friend_link_id as friendLinkId, " +
      "fl.name as friendName, " +
      "fl.url as friendUrl, " +
      "fl.avatar_url as friendAvatarUrl, " +
      "fl.description as friendDescription, " +
      "rs.rss_url as rssUrl, " +
      "rs.created_at as createdAt " +
      "FROM rss_sources rs " +
      "INNER JOIN friendlinks fl ON rs.friend_link_id = fl.id " +
      "WHERE rs.is_active = true " +
      "ORDER BY fl.name, rs.created_at DESC")
  List<RssFeedDTO> getRssSourcesWithFriendLinks();
}