package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Thoughts;
import com.example.blogbackend.service.IThoughtsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 用户思考记录表 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-05-14
 */
@RestController
@RequestMapping("/thoughts")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class ThoughtsController {

  @Autowired
  private IThoughtsService thoughtsService;

  // 查询所有
  @GetMapping
  public List<Thoughts> getAll() {
    return thoughtsService.list();
  }

  // 根据ID查询
  @GetMapping("/{id}")
  public Thoughts getById(@PathVariable Integer id) {
    return thoughtsService.getById(id);
  }

  // 新增
  @PostMapping
  public boolean create(@RequestBody Thoughts thoughts) {
    return thoughtsService.save(thoughts);
  }

  // 修改
  @PutMapping
  public boolean update(@RequestBody Thoughts thoughts) {
    return thoughtsService.updateById(thoughts);
  }

  // 删除
  @DeleteMapping("/{id}")
  public boolean delete(@PathVariable Integer id) {
    return thoughtsService.removeById(id);
  }
}
