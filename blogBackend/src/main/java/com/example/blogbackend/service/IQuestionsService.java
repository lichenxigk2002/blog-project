package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.entity.Questions;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
public interface IQuestionsService extends IService<Questions> {
  /**
   * 获取问题列表
   *
   * @param page       分页参数
   * @param search     搜索关键词
   * @param difficulty 难度级别
   * @return 分页的问题列表
   */
  Page<QuestionDTO> getQuestionsWithTags(Page<QuestionDTO> page, String search, String difficulty);

  /**
   * 获取问题详情
   *
   * @param id 问题ID
   * @return 问题详情
   */
  QuestionDTO getQuestionWithTagsById(Integer id);

  /**
   * 点赞问题
   *
   * @param id 问题ID
   * @return 更新后的问题详情
   */
  QuestionDTO likeQuestion(Integer id);

  /**
   * 更新问题
   *
   * @param id          问题ID
   * @param questionDTO 问题DTO
   * @return 更新后的问题详情
   */
  QuestionDTO updateQuestion(Integer id, QuestionDTO questionDTO);

  /**
   * 创建问题
   *
   * @param questionDTO 问题DTO
   * @return 创建后的问题详情
   */
  QuestionDTO createQuestion(QuestionDTO questionDTO);
}
