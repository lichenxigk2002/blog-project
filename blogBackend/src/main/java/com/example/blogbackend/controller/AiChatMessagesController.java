package com.example.blogbackend.controller;

import com.example.blogbackend.entity.AiChatMessages;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.ResultCodeEnum;
import com.example.blogbackend.service.IAiChatMessagesService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * AI对话消息表 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
@RestController
@RequestMapping("/ai-chat-messages")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
@Slf4j
public class AiChatMessagesController {

    @Autowired
    private IAiChatMessagesService aiChatMessagesService;

    /**
     * 获取会话下的所有消息
     */
    @GetMapping("/session/{sessionId}")
    public Result getMessagesBySessionId(@PathVariable Integer sessionId) {
        try {
            QueryWrapper<AiChatMessages> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("session_id", sessionId)
                    .orderByAsc("created_at");
            List<AiChatMessages> messages = aiChatMessagesService.list(queryWrapper);
            log.info("获取消息列表成功:"+messages);
            return Result.ok(messages);
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("获取消息列表失败: " + e.getMessage());
        }
    }

    /**
     * 保存单条消息
     */
    @PostMapping
    public Result saveMessage(@RequestBody AiChatMessages message) {
        try {
            // 设置创建时间
            message.setCreatedAt(LocalDateTime.now());

            boolean saved = aiChatMessagesService.save(message);
            if (saved) {
                return Result.ok(message);
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("保存消息失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("保存消息失败: " + e.getMessage());
        }
    }

    /**
     * 批量保存消息
     */
    @PostMapping("/batch")
    public Result saveMessagesBatch(@RequestBody List<AiChatMessages> messages) {
        try {
            // 为每条消息设置创建时间
            LocalDateTime now = LocalDateTime.now();
            for (AiChatMessages message : messages) {
                message.setCreatedAt(now);
            }

            boolean saved = aiChatMessagesService.saveBatch(messages);
            if (saved) {
                return Result.ok("批量保存成功");
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("批量保存消息失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("批量保存消息失败: " + e.getMessage());
        }
    }

    /**
     * 删除消息
     */
    @DeleteMapping("/{messageId}")
    public Result deleteMessage(@PathVariable Integer messageId) {
        try {
            boolean removed = aiChatMessagesService.removeById(messageId);
            if (removed) {
                return Result.ok("删除成功");
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("删除消息失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("删除消息失败: " + e.getMessage());
        }
    }

    /**
     * 获取单条消息详情
     */
    @GetMapping("/{messageId}")
    public Result getMessageById(@PathVariable Integer messageId) {
        try {
            AiChatMessages message = aiChatMessagesService.getById(messageId);
            if (message != null) {
                return Result.ok(message);
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("消息不存在");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("获取消息详情失败: " + e.getMessage());
        }
    }

    /**
     * 清空会话下的所有消息
     */
    @DeleteMapping("/session/{sessionId}")
    public Result clearSessionMessages(@PathVariable Integer sessionId) {
        try {
            QueryWrapper<AiChatMessages> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("session_id", sessionId);
            boolean removed = aiChatMessagesService.remove(queryWrapper);
            if (removed) {
                return Result.ok("清空消息成功");
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("清空消息失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("清空消息失败: " + e.getMessage());
        }
    }
}