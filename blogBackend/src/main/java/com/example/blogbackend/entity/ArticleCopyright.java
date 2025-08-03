package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 文章版权信息表
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("article_copyrights")
public class ArticleCopyright implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * 主键ID
   */
  @TableId(value = "id", type = IdType.AUTO)
  private Integer id;

  /**
   * 关联文章ID
   */
  private Integer articleId;

  /**
   * 许可协议类型
   */
  private String licenseType;

  /**
   * 版权持有者
   */
  private String copyrightHolder;

  /**
   * IPFS文件哈希值
   */
  private String ipfsHash;

  /**
   * 区块链交易哈希
   */
  private String blockchainTxHash;

  /**
   * 智能合约地址
   */
  private String blockchainContractAddress;

  /**
   * Crossbell Note ID
   */
  private String noteId;

  /**
   * 创建时间
   */
  private LocalDateTime createdAt;

  /**
   * 更新时间
   */
  private LocalDateTime updatedAt;

  /**
   * 关联的文章信息
   */
  @TableField(exist = false)
  private Articles article;

  /**
   * 关联的许可协议信息
   */
  @TableField(exist = false)
  private LicenseType licenseTypeInfo;
}