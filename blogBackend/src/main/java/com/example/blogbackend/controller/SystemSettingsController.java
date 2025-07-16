package com.example.blogbackend.controller;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.stereotype.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.blogbackend.entity.SystemSettings;
import com.example.blogbackend.service.ISystemSettingsService;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-07-11
 */
@RestController
@RequestMapping("/system-settings")
public class SystemSettingsController {
  @Autowired
  private ISystemSettingsService systemSettingsService;

  // 1. 获取全部设置
  @GetMapping("/get")
  public SystemSettings getSettings() {
    // 假设只有一行，id=1
    return systemSettingsService.getById(1);
  }

  // 2. 单项保存（每个字段一个接口）
  @PostMapping("/set/{field}")
  public Map<String, Object> setSingleField(@PathVariable String field, @RequestBody Map<String, Object> body) {
    SystemSettings settings = systemSettingsService.getById(1);
    if (settings == null) {
      settings = new SystemSettings();
      settings.setId(1);
    }
    Object value = body.get("value");
    boolean updated = false;
    switch (field) {
      case "showAdminLoginEntry":
        settings.setShowAdminLoginEntry((Boolean) value);
        updated = true;
        break;
      case "commentsEnabled":
        settings.setCommentsEnabled((Boolean) value);
        updated = true;
        break;
      case "autoSaveEnabled":
        settings.setAutoSaveEnabled((Boolean) value);
        updated = true;
        break;
      case "userRegistration":
        settings.setUserRegistration((Boolean) value);
        updated = true;
        break;
      case "maxUploadSize":
        settings.setMaxUploadSize((Integer) value);
        updated = true;
        break;
      case "allowHtmlInMarkdown":
        settings.setAllowHtmlInMarkdown((Boolean) value);
        updated = true;
        break;
      case "emailNotifications":
        settings.setEmailNotifications((Boolean) value);
        updated = true;
        break;
      case "newArticleNotification":
        settings.setNewArticleNotification((Boolean) value);
        updated = true;
        break;
      case "commentNotification":
        settings.setCommentNotification((Boolean) value);
        updated = true;
        break;
      case "systemMaintenance":
        settings.setSystemMaintenance((Boolean) value);
        updated = true;
        break;
      case "theme":
        settings.setTheme((String) value);
        updated = true;
        break;
      case "language":
        settings.setLanguage((String) value);
        updated = true;
        break;
      case "sidebarCollapsed":
        settings.setSidebarCollapsed((Boolean) value);
        updated = true;
        break;
      case "showBreadcrumb":
        settings.setShowBreadcrumb((Boolean) value);
        updated = true;
        break;
      case "showWatermark":
        settings.setShowWatermark((Boolean) value);
        updated = true;
        break;
      case "serverPort":
        settings.setServerPort((Integer) value);
        updated = true;
        break;
      case "databaseStatus":
        settings.setDatabaseStatus((String) value);
        updated = true;
        break;
      case "uploadPath":
        settings.setUploadPath((String) value);
        updated = true;
        break;
      case "version":
        settings.setVersion((String) value);
        updated = true;
        break;
      // lastUpdate 不建议单独设置
      default:
        break;
    }
    Map<String, Object> result = new HashMap<>();
    if (updated) {
      systemSettingsService.saveOrUpdate(settings);
      result.put("success", true);
    } else {
      result.put("success", false);
      result.put("msg", "Unknown field");
    }
    return result;
  }

  // 3. 总体保存（一次性保存所有设置）
  @PostMapping("/save")
  public Map<String, Object> saveAll(@RequestBody SystemSettings newSettings) {
    newSettings.setId(1); // 只允许一行
    systemSettingsService.saveOrUpdate(newSettings);
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    return result;
  }

  // 4. 重置为默认
  @PostMapping("/reset")
  public Map<String, Object> resetToDefault() {
    SystemSettings defaultSettings = new SystemSettings();
    defaultSettings.setId(1);
    defaultSettings.setCommentsEnabled(true);
    defaultSettings.setAutoSaveEnabled(false);
    defaultSettings.setUserRegistration(true);
    defaultSettings.setMaxUploadSize(10);
    defaultSettings.setAllowHtmlInMarkdown(false);
    defaultSettings.setEmailNotifications(false);
    defaultSettings.setNewArticleNotification(false);
    defaultSettings.setCommentNotification(false);
    defaultSettings.setSystemMaintenance(false);
    defaultSettings.setTheme("light");
    defaultSettings.setLanguage("zh-CN");
    defaultSettings.setSidebarCollapsed(false);
    defaultSettings.setShowBreadcrumb(true);
    defaultSettings.setShowWatermark(false);
    defaultSettings.setServerPort(8080);
    defaultSettings.setDatabaseStatus("OK");
    defaultSettings.setUploadPath("/uploads");
    defaultSettings.setVersion("1.0.0");
    defaultSettings.setLastUpdate(java.time.LocalDateTime.now());
    defaultSettings.setShowAdminLoginEntry(false);
    systemSettingsService.saveOrUpdate(defaultSettings);
    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    return result;
  }
}
