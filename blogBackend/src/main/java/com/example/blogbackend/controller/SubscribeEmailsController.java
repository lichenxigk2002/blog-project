package com.example.blogbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import com.example.blogbackend.service.ISubscribeEmailsService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.List;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-07-05
 */
@Controller
@RequestMapping("/subscribe_emails")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class SubscribeEmailsController {

  @Autowired
  private ISubscribeEmailsService subscribeEmailsService;

  @PostMapping("/subscribe")
  @ResponseBody
  public Map<String, Object> subscribe(@RequestBody Map<String, String> req, HttpServletRequest request) {
    String email = req.get("email");
    String name = req.get("name");
    String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    try {
      boolean ok = subscribeEmailsService.subscribe(email, name, baseUrl);
      if (ok) {
        return Map.of("success", true, "message", "订阅成功，邮件已发送！");
      } else {
        return Map.of("success", false, "message", "邮箱格式不正确");
      }
    } catch (RuntimeException e) {
      return Map.of("success", false, "message", e.getMessage());
    }
  }

  @GetMapping("/list")
  @ResponseBody
  public Map<String, Object> getSubscribers() {
    try {
      List<com.example.blogbackend.entity.SubscribeEmails> subscribers = subscribeEmailsService
          .lambdaQuery()
          .eq(com.example.blogbackend.entity.SubscribeEmails::getSubscribed, true)
          .list();
      return Map.of("success", true, "data", subscribers);
    } catch (Exception e) {
      return Map.of("success", false, "message", "获取订阅用户列表失败：" + e.getMessage());
    }
  }

  @GetMapping("/unsubscribe")
  public String unsubscribe(@RequestParam String token, Model model) {
    try {
      boolean ok = subscribeEmailsService.unsubscribe(token);
      if (ok) {
        model.addAttribute("success", true);
        model.addAttribute("message", "退订成功！感谢您一直以来的关注与支持！");
      } else {
        model.addAttribute("success", false);
        model.addAttribute("message", "退订失败，链接无效或已过期。如有疑问请联系管理员。");
      }
    } catch (RuntimeException e) {
      model.addAttribute("success", false);
      model.addAttribute("message", "退订过程中出现错误：" + e.getMessage());
    }
    return "unsubscribeSuccess";
  }

  // 添加一个简单的退订页面，用于测试
  @GetMapping("/unsub")
  public String unsubscribePage(@RequestParam String t, Model model) {
    return unsubscribe(t, model);
  }

  @DeleteMapping("/unsubscribe")
  @ResponseBody
  public Map<String, Object> unsubscribeApi(@RequestBody Map<String, String> request) {
    String token = request.get("token");
    try {
      boolean ok = subscribeEmailsService.unsubscribe(token);
      if (ok) {
        return Map.of("success", true, "message", "退订成功！感谢您一直以来的关注与支持！");
      } else {
        return Map.of("success", false, "message", "退订失败，链接无效或已过期。");
      }
    } catch (RuntimeException e) {
      return Map.of("success", false, "message", "退订过程中出现错误：" + e.getMessage());
    }
  }
}
