package com.example.blogbackend.controller;

import com.example.blogbackend.entity.User;
import com.example.blogbackend.service.IUserService;
import com.example.blogbackend.utils.EmailUtil;
import com.example.blogbackend.utils.JwtHelper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/auth/email")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class EmailAuthController {

  @Autowired
  private EmailUtil emailUtil;

  @Autowired
  private IUserService userService;

  @Autowired
  private JwtHelper jwtHelper;

  // 用于存储验证码和过期时间（开发环境可用，生产建议用Redis）
  private final Map<String, String> codeCache = new ConcurrentHashMap<>();
  private final Map<String, Long> codeExpire = new ConcurrentHashMap<>();

  // 发送验证码（十分钟有效）
  @PostMapping("/send")
  public ResponseEntity<?> sendCode(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
      return ResponseEntity.badRequest().body(Map.of("message", "邮箱格式不正确"));
    }
    // 生成6位验证码
    String code = String.valueOf((int) ((Math.random() * 9 + 1) * 100000));
    // 存储验证码和过期时间（10分钟）
    codeCache.put(email, code);
    codeExpire.put(email, System.currentTimeMillis() + 10 * 60 * 1000);
    // 发送邮件
    emailUtil.sendVerificationCodeMail(email, code);
    return ResponseEntity.ok(Map.of("message", "验证码已发送"));
  }

  // 邮箱验证码一键登录/注册
  @PostMapping("/login")
  public ResponseEntity<?> loginOrRegister(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    String code = req.get("code");
    if (email == null || code == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "参数缺失"));
    }
    // 校验验证码
    String cachedCode = codeCache.get(email);
    Long expire = codeExpire.get(email);
    if (cachedCode == null || expire == null || System.currentTimeMillis() > expire) {
      return ResponseEntity.badRequest().body(Map.of("message", "验证码已过期"));
    }
    if (!cachedCode.equals(code)) {
      return ResponseEntity.badRequest().body(Map.of("message", "验证码错误"));
    }
    // 验证码通过后清除
    codeCache.remove(email);
    codeExpire.remove(email);

    // 查找用户
    User user = userService.getOne(new QueryWrapper<User>().eq("email_account", email));
    if (user == null) {
      // 自动注册
      user = new User();
      user.setEmailAccount(email);
      user.setUsername("user_" + UUID.randomUUID().toString().substring(0, 8));
      user.setPassword(UUID.randomUUID().toString()); // 随机密码
      user.setLoginType("email");
      userService.save(user);
    }
    // 生成token
    String token = jwtHelper.createToken(user.getId().longValue());

    // 返回结构统一为 { code, data: { token, user }, message }
    Map<String, Object> data = Map.of(
        "token", token,
        "user", user);
    return ResponseEntity.ok(Map.of(
        "code", 200,
        "data", data,
        "message", "登录成功"));
  }

  // 绑定邮箱
  @PostMapping("/bind")
  public ResponseEntity<?> bindEmail(@RequestBody Map<String, String> req) {
    String email = req.get("email");
    String code = req.get("code");
    Integer userId = null;
    try {
      userId = Integer.valueOf(req.get("userId"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", "参数错误"));
    }
    if (email == null || code == null || userId == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "参数缺失"));
    }
    // 校验验证码
    String cachedCode = codeCache.get(email);
    Long expire = codeExpire.get(email);
    if (cachedCode == null || expire == null || System.currentTimeMillis() > expire) {
      return ResponseEntity.badRequest().body(Map.of("message", "验证码已过期"));
    }
    if (!cachedCode.equals(code)) {
      return ResponseEntity.badRequest().body(Map.of("message", "验证码错误"));
    }
    // 验证码通过后清除
    codeCache.remove(email);
    codeExpire.remove(email);

    // 绑定邮箱
    User user = userService.getById(userId);
    if (user == null) {
      return ResponseEntity.badRequest().body(Map.of("message", "用户不存在"));
    }
    user.setEmailAccount(email);
    userService.updateById(user);

    return ResponseEntity.ok(Map.of(
        "code", 200,
        "message", "绑定成功",
        "user", user));
  }
}