package com.example.blogbackend.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.entity.Bulletinboard;
import com.example.blogbackend.service.IBulletinboardService;
import com.example.blogbackend.utils.CosUtil;
import com.example.blogbackend.utils.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 留言板 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-05-16
 */
@RestController
@RequestMapping("/bulletinboard")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class BulletinboardController {

  @Autowired
  private IBulletinboardService bulletinboardService;

  @Autowired
  private CosUtil cosUtil;

  @Autowired
  private EmailUtil emailUtil;

  /**
   * 创建留言
   */
  @PostMapping
  public ResponseEntity<?> createMessage(@RequestBody Bulletinboard message) {
    message.setCreatedAt(LocalDateTime.now());
    message.setUpdatedAt(LocalDateTime.now());
    message.setStatus("approved"); // 默认待审核状态
    message.setIsPinned(false); // 默认不置顶
    bulletinboardService.save(message);
    return ResponseEntity.ok(message);
  }

  /**
   * 获取留言列表（分页）
   */
  @GetMapping
  public ResponseEntity<?> getMessages(
      @RequestParam(defaultValue = "1") Integer current,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(required = false) String status) {

    Page<Bulletinboard> page = new Page<>(current, size);
    QueryWrapper<Bulletinboard> queryWrapper = new QueryWrapper<>();

    if (status != null && !status.isEmpty()) {
      queryWrapper.eq("status", status);
    }

    // 先按置顶排序，再按创建时间排序
    queryWrapper.orderByDesc("is_pinned").orderByDesc("created_at");
    Page<Bulletinboard> result = bulletinboardService.page(page, queryWrapper);

    Map<String, Object> response = new HashMap<>();
    response.put("records", result.getRecords());
    response.put("total", result.getTotal());
    response.put("size", result.getSize());
    response.put("current", result.getCurrent());

    return ResponseEntity.ok(response);
  }

  /**
   * 获取单个留言详情
   */
  @GetMapping("/{id}")
  public ResponseEntity<?> getMessage(@PathVariable Integer id) {
    Bulletinboard message = bulletinboardService.getById(id);
    if (message == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(message);
  }

  /**
   * 更新留言
   */
  @PutMapping("/{id}")
  public ResponseEntity<?> updateMessage(
      @PathVariable Integer id,
      @RequestBody Bulletinboard message) {

    Bulletinboard existingMessage = bulletinboardService.getById(id);
    if (existingMessage == null) {
      return ResponseEntity.notFound().build();
    }

    // 更新消息内容
    existingMessage.setName(message.getName());
    existingMessage.setEmail(message.getEmail());
    existingMessage.setGender(message.getGender());
    existingMessage.setContent(message.getContent());
    existingMessage.setStatus(message.getStatus());
    existingMessage.setIsPinned(message.getIsPinned());
    existingMessage.setReply(message.getReply());
    existingMessage.setAvatar(message.getAvatar());
    existingMessage.setUpdatedAt(LocalDateTime.now());

    bulletinboardService.updateById(existingMessage);
    return ResponseEntity.ok(existingMessage);
  }

  /**
   * 删除留言
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteMessage(@PathVariable Integer id) {
    Bulletinboard message = bulletinboardService.getById(id);
    if (message == null) {
      return ResponseEntity.notFound().build();
    }

    bulletinboardService.removeById(id);
    return ResponseEntity.ok().build();
  }

  /**
   * 回复留言
   */
  @PostMapping("/{id}/reply")
  public ResponseEntity<?> replyMessage(@PathVariable Integer id, @RequestBody Map<String, String> replyData) {
    Bulletinboard message = bulletinboardService.getById(id);
    if (message == null) {
      return ResponseEntity.notFound().build();
    }

    message.setReply(replyData.get("reply"));
    message.setReplyTime(LocalDateTime.now());
    message.setStatus("approved"); // 回复后自动设置为已通过状态
    message.setUpdatedAt(LocalDateTime.now());

    bulletinboardService.updateById(message);

    if (replyData.get("sendEmail") != null && Boolean.parseBoolean(replyData.get("sendEmail"))) {
      emailUtil.sendReplyToMessageMail(
              message.getEmail(),
              message.getName(),
              message.getGender(),
              message.getContent(),
              message.getReply()
      );
    }
    return ResponseEntity.ok(message);
  }

  /**
   * 更新留言状态
   */
  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusData) {
    Bulletinboard message = bulletinboardService.getById(id);
    if (message == null) {
      return ResponseEntity.notFound().build();
    }

    message.setStatus(statusData.get("status"));
    message.setUpdatedAt(LocalDateTime.now());

    bulletinboardService.updateById(message);
    return ResponseEntity.ok(message);
  }

  /**
   * 上传头像
   */
  @PostMapping("/upload-avatar")
  public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
    try {
      String avatarUrl = cosUtil.uploadFile(file);
      Map<String, String> response = new HashMap<>();
      response.put("url", avatarUrl);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("头像上传失败：" + e.getMessage());
    }
  }
}
