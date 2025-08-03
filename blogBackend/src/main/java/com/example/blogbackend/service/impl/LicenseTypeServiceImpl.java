package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.LicenseType;
import com.example.blogbackend.mapper.LicenseTypeMapper;
import com.example.blogbackend.service.LicenseTypeService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 许可协议配置服务实现类
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@Service
public class LicenseTypeServiceImpl extends ServiceImpl<LicenseTypeMapper, LicenseType> implements LicenseTypeService {

  @Override
  public List<LicenseType> getActiveLicenses() {
    return baseMapper.selectActiveLicenses();
  }

  @Override
  public LicenseType getByCode(String code) {
    return baseMapper.selectByCode(code);
  }
}