package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Friendlinks;
import com.example.blogbackend.service.IFriendlinksService;
import com.example.blogbackend.utils.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-05-24
 */
@RestController
@RequestMapping("/friendlinks")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class FriendlinksController {

  @Autowired
  private IFriendlinksService friendlinksService;

  @Autowired
  private EmailUtil emailUtil;

  /**
   * 获取所有友链
   */
  @GetMapping
  public ResponseEntity<List<Friendlinks>> list() {
    return ResponseEntity.ok(friendlinksService.list());
  }

  /**
   * 根据ID获取友链
   */
  @GetMapping("/{id}")
  public ResponseEntity<Friendlinks> getById(@PathVariable Integer id) {
    return ResponseEntity.ok(friendlinksService.getById(id));
  }

  /**
   * 创建友链
   */
  @PostMapping
  public ResponseEntity<Friendlinks> create(@RequestBody Friendlinks friendlinks) {
    friendlinks.setCreatedAt(LocalDateTime.now());
    friendlinks.setUpdatedAt(LocalDateTime.now());
    friendlinksService.save(friendlinks);
    // 新增：保存后自动邮件通知
    emailUtil.sendNewFriendLinkMail(
        friendlinks.getName(),
        friendlinks.getUrl(),
        friendlinks.getDescription(),
        "");
    return ResponseEntity.ok(friendlinks);
  }

  /**
   * 更新友链
   */
  @PutMapping("/{id}")
  public ResponseEntity<Friendlinks> update(@PathVariable Integer id, @RequestBody Friendlinks friendlinks) {
    friendlinks.setId(id);
    friendlinks.setUpdatedAt(LocalDateTime.now());
    friendlinksService.updateById(friendlinks);
    return ResponseEntity.ok(friendlinks);
  }

  /**
   * 删除友链
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Integer id) {
    friendlinksService.removeById(id);
    return ResponseEntity.ok().build();
  }
}
