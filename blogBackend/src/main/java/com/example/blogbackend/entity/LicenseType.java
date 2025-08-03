package com.example.blogbackend.entity;

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
 * 许可协议配置表
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("license_types")
public class LicenseType implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * 主键ID
   */
  @TableId(value = "id", type = IdType.AUTO)
  private Integer id;

  /**
   * 许可协议名称
   */
  private String name;

  /**
   * 许可协议代码
   */
  private String code;

  /**
   * 详细描述
   */
  private String description;

  /**
   * 官方链接
   */
  private String url;

  /**
   * 是否启用：0-禁用，1-启用
   */
  private Boolean isActive;

  /**
   * 创建时间
   */
  private LocalDateTime createdAt;
}