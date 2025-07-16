package com.example.blogbackend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.common.Result;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.service.IQuestionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Slf4j
@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class QuestionsController {

  @Autowired
  private IQuestionsService questionsService;

  /**
   * 获取面试题列表
   *
   * @param current    当前页码
   * @param size       每页大小
   * @param search     搜索关键词
   * @param difficulty 难度级别
   * @return 分页的面试题列表
   */
  @GetMapping
  public Result<Page<QuestionDTO>> getQuestions(
      @RequestParam(defaultValue = "1") Integer current,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String difficulty) {
    try {
      log.info("获取问题列表，页码：{}，每页大小：{}，搜索词：{}，难度：{}",
          current, size, search, difficulty);

      Page<QuestionDTO> page = new Page<>(current, size);
      Page<QuestionDTO> result = questionsService.getQuestionsWithTags(page, search, difficulty);
      return Result.success(result);
    } catch (Exception e) {
      log.error("获取问题列表失败，错误：{}", e.getMessage(), e);
      return Result.error("获取问题列表失败：" + e.getMessage());
    }
  }

  /**
   * 获取面试题详情
   *
   * @param id 面试题ID
   * @return 面试题详情
   */
  @GetMapping("/{id}")
  public Result<QuestionDTO> getQuestionById(@PathVariable Integer id) {
    try {
      log.info("获取问题详情，ID：{}", id);
      QuestionDTO question = questionsService.getQuestionWithTagsById(id);
      if (question == null) {
        return Result.error("问题不存在");
      }
      return Result.success(question);
    } catch (Exception e) {
      log.error("获取问题详情失败，ID：{}，错误：{}", id, e.getMessage(), e);
      return Result.error("获取问题详情失败：" + e.getMessage());
    }
  }

  /**
   * 点赞面试题
   *
   * @param id 面试题ID
   * @return 更新后的面试题
   */
  @PostMapping("/{id}/like")
  public Result<QuestionDTO> likeQuestion(@PathVariable Integer id) {
    try {
      log.info("点赞问题，ID：{}", id);
      QuestionDTO question = questionsService.likeQuestion(id);
      return Result.success(question);
    } catch (Exception e) {
      log.error("点赞问题失败，ID：{}，错误：{}", id, e.getMessage(), e);
      return Result.error("点赞问题失败：" + e.getMessage());
    }
  }

  /**
   * 更新面试题
   *
   * @param id          面试题ID
   * @param questionDTO 面试题数据
   * @return 更新后的面试题
   */
  @PutMapping("/{id}")
  public Result<QuestionDTO> updateQuestion(@PathVariable Integer id, @RequestBody QuestionDTO questionDTO) {
    try {
      log.info("收到更新问题请求，ID：{}，请求体：{}", id, questionDTO);

      if (questionDTO == null) {
        log.error("请求体为空");
        return Result.error("请求体不能为空");
      }

      if (id == null) {
        log.error("问题ID为空");
        return Result.error("问题ID不能为空");
      }

      QuestionDTO updatedQuestion = questionsService.updateQuestion(id, questionDTO);
      if (updatedQuestion == null) {
        log.error("问题不存在，ID：{}", id);
        return Result.error("问题不存在");
      }

      log.info("问题更新成功，ID：{}，更新后的数据：{}", id, updatedQuestion);
      return Result.success(updatedQuestion);
    } catch (Exception e) {
      log.error("更新问题失败，ID：{}，错误：{}", id, e.getMessage(), e);
      return Result.error("更新问题失败：" + e.getMessage());
    }
  }

  /**
   * 删除面试题
   *
   * @param id 面试题ID
   * @return 操作结果
   */
  @DeleteMapping("/{id}")
  public Result<?> deleteQuestion(@PathVariable Integer id) {
    try {
      log.info("删除问题，ID：{}", id);
      boolean removed = questionsService.removeById(id);
      if (!removed) {
        return Result.error("问题不存在");
      }
      return Result.success(null);
    } catch (Exception e) {
      log.error("删除问题失败，ID：{}，错误：{}", id, e.getMessage(), e);
      return Result.error("删除问题失败：" + e.getMessage());
    }
  }

  /**
   * 创建面试题
   *
   * @param questionDTO 面试题数据
   * @return 创建后的面试题
   */
  @PostMapping
  public Result<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
    try {
      log.info("收到创建问题请求，请求体：{}", questionDTO);
      if (questionDTO == null) {
        log.error("请求体为空");
        return Result.error("请求体不能为空");
      }
      QuestionDTO created = questionsService.createQuestion(questionDTO);
      if (created == null) {
        log.error("创建失败");
        return Result.error("创建失败");
      }
      log.info("问题创建成功，数据：{}", created);
      return Result.success(created);
    } catch (Exception e) {
      log.error("创建问题失败，错误：{}", e.getMessage(), e);
      return Result.error("创建问题失败：" + e.getMessage());
    }
  }
}
