package com.example.blogbackend.controller;

import com.example.blogbackend.entity.LicenseType;
import com.example.blogbackend.service.LicenseTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 * 许可协议配置控制器
 * </p>
 *
 * @author author
 * @since 2025-08-03
 */
@RestController
@RequestMapping("/api/license")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class LicenseTypeController {

  @Autowired
  private LicenseTypeService licenseTypeService;

  /**
   * 获取所有启用的许可协议
   *
   * @return 启用的许可协议列表
   */
  @GetMapping("/active")
  public ResponseEntity<List<LicenseType>> getActiveLicenses() {
    try {
      List<LicenseType> licenses = licenseTypeService.getActiveLicenses();
      return ResponseEntity.ok(licenses);
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }

  /**
   * 根据代码获取许可协议
   *
   * @param code 许可协议代码
   * @return 许可协议信息
   */
  @GetMapping("/code/{code}")
  public ResponseEntity<LicenseType> getByCode(@PathVariable String code) {
    try {
      LicenseType license = licenseTypeService.getByCode(code);
      if (license != null) {
        return ResponseEntity.ok(license);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (Exception e) {
      return ResponseEntity.internalServerError().build();
    }
  }
}