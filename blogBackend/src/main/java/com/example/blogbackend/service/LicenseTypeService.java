package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.LicenseType;

import java.util.List;

/**
 * <p>
 * 许可协议配置服务类
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
public interface LicenseTypeService extends IService<LicenseType> {

  /**
   * 获取所有启用的许可协议
   *
   * @return 启用的许可协议列表
   */
  List<LicenseType> getActiveLicenses();

  /**
   * 根据代码获取许可协议
   *
   * @param code 许可协议代码
   * @return 许可协议信息
   */
  LicenseType getByCode(String code);
}