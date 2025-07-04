package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.entity.Questions;
import com.example.blogbackend.mapper.QuestionsMapper;
import com.example.blogbackend.service.IQuestionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Slf4j
@Service
public class QuestionsServiceImpl extends ServiceImpl<QuestionsMapper, Questions> implements IQuestionsService {

  @Override
  public Page<QuestionDTO> getQuestionsWithTags(Page<QuestionDTO> page, String search, String difficulty) {
    try {
      log.info("开始查询问题列表，页码：{}，每页大小：{}，搜索词：{}，难度：{}",
          page.getCurrent(), page.getSize(), search, difficulty);

      // 执行查询
      List<QuestionDTO> records = baseMapper.selectQuestionsWithTags(page, search, difficulty);
      log.info("查询到 {} 条记录", records.size());

      // 设置分页结果
      page.setRecords(records);
      return page;
    } catch (Exception e) {
      log.error("查询问题列表失败，错误：{}", e.getMessage(), e);
      throw e;
    }
  }

  @Override
  public QuestionDTO getQuestionWithTagsById(Integer id) {
    try {
      log.info("开始获取问题详情，ID：{}", id);
      QuestionDTO question = baseMapper.selectQuestionWithTagsById(id);
      if (question == null) {
        log.error("问题不存在，ID：{}", id);
        throw new RuntimeException("问题不存在");
      }
      log.info("获取问题详情成功，ID：{}", id);
      return question;
    } catch (Exception e) {
      log.error("获取问题详情失败，ID：{}，错误：{}", id, e.getMessage(), e);
      throw e;
    }
  }

  @Override
  @Transactional
  public QuestionDTO updateQuestion(Integer id, QuestionDTO questionDTO) {
    try {
      log.info("开始更新问题，ID：{}，数据：{}", id, questionDTO);

      // 检查问题是否存在
      Questions question = this.getById(id);
      if (question == null) {
        log.error("问题不存在，ID：{}", id);
        return null;
      }

      // 更新问题基本信息
      question.setTitle(questionDTO.getTitle());
      question.setContent(questionDTO.getContent());
      question.setDifficulty(questionDTO.getDifficulty());
      question.setStatus(questionDTO.getStatus());
      question.setUpdatedAt(LocalDateTime.now());

      // 保存更新
      boolean updated = this.updateById(question);
      if (!updated) {
        log.error("更新问题基本信息失败，ID：{}", id);
        throw new RuntimeException("更新问题基本信息失败");
      }

      // 返回更新后的问题详情
      QuestionDTO updatedQuestion = getQuestionWithTagsById(id);
      log.info("问题更新成功，ID：{}", id);
      return updatedQuestion;
    } catch (Exception e) {
      log.error("更新问题失败，ID：{}，错误：{}", id, e.getMessage(), e);
      throw e;
    }
  }

  @Override
  @Transactional
  public QuestionDTO likeQuestion(Integer id) {
    try {
      log.info("开始点赞问题，ID：{}", id);

      // 获取问题
      Questions question = this.getById(id);
      if (question == null) {
        log.error("问题不存在，ID：{}", id);
        throw new RuntimeException("问题不存在");
      }

      // 增加点赞数
      question.setLikes(question.getLikes() + 1);
      boolean updated = this.updateById(question);
      if (!updated) {
        log.error("更新点赞数失败，ID：{}", id);
        throw new RuntimeException("更新点赞数失败");
      }

      // 返回更新后的问题详情
      QuestionDTO updatedQuestion = getQuestionWithTagsById(id);
      log.info("问题点赞成功，ID：{}", id);
      return updatedQuestion;
    } catch (Exception e) {
      log.error("点赞问题失败，ID：{}，错误：{}", id, e.getMessage(), e);
      throw e;
    }
  }

  @Override
  @Transactional
  public QuestionDTO createQuestion(QuestionDTO questionDTO) {
    try {
      log.info("开始创建问题，数据：{}", questionDTO);
      // 构造实体
      Questions question = new Questions();
      question.setTitle(questionDTO.getTitle());
      question.setContent(questionDTO.getContent());
      question.setDifficulty(questionDTO.getDifficulty());
      question.setStatus(questionDTO.getStatus());
      question.setViews(questionDTO.getViews() != null ? questionDTO.getViews() : 0);
      question.setLikes(questionDTO.getLikes() != null ? questionDTO.getLikes() : 0);
      question.setCreatedAt(java.time.LocalDateTime.now());
      question.setUpdatedAt(java.time.LocalDateTime.now());
      // 插入数据库
      boolean saved = this.save(question);
      if (!saved) {
        log.error("插入问题失败");
        throw new RuntimeException("插入问题失败");
      }
      // 查询插入后的完整 DTO
      QuestionDTO created = baseMapper.selectQuestionWithTagsById(question.getId());
      log.info("问题创建成功，ID：{}", question.getId());
      return created;
    } catch (Exception e) {
      log.error("创建问题失败，错误：{}", e.getMessage(), e);
      throw e;
    }
  }
}
