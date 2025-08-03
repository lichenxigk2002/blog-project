package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.entity.LicenseType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 * 许可协议配置 Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Mapper
public interface LicenseTypeMapper extends BaseMapper<LicenseType> {

  /**
   * 查询所有启用的许可协议
   *
   * @return 启用的许可协议列表
   */
  @Select("SELECT * FROM license_types WHERE is_active = 1 ORDER BY id")
  List<LicenseType> selectActiveLicenses();

  /**
   * 根据代码查询许可协议
   *
   * @param code 许可协议代码
   * @return 许可协议信息
   */
  @Select("SELECT * FROM license_types WHERE code = #{code}")
  LicenseType selectByCode(@Param("code") String code);
}