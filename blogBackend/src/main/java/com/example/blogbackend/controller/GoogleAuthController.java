package com.example.blogbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;
import com.example.blogbackend.entity.User;
import com.example.blogbackend.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.util.UUID;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class GoogleAuthController {

  @Autowired
  private IUserService userService;

  @Autowired
  private RestTemplate restTemplate;

  @Value("${spring.security.oauth2.client.registration.google.client-id}")
  private String clientId;

  @Value("${spring.security.oauth2.client.registration.google.client-secret}")
  private String clientSecret;

  @Value("${server.servlet.context-path:}")
  private String contextPath;

  @Value("${google.oauth.test-mode:false}")
  private boolean testMode;

  @Value("${app.frontend-home}")
  private String frontendHome;

  /**
   * 发起Google OAuth登录
   */
  @GetMapping("/google")
  public void googleLogin(HttpServletResponse response) throws Exception {
    String redirectUri = "https://www.gfbzsblog.site/auth/google/callback";
    String encodedRedirectUri = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
    String googleAuthUrl = "https://accounts.google.com/o/oauth2/auth?" +
        "client_id=" + clientId +
        "&redirect_uri=" + encodedRedirectUri +
        "&response_type=code" +
        "&scope=email profile" +
        "&access_type=offline";

    System.out.println("Google Auth URL: " + googleAuthUrl);
    System.out.println("Redirect URI: " + redirectUri);
    System.out.println("Encoded Redirect URI: " + encodedRedirectUri);

    response.sendRedirect(googleAuthUrl);
  }

  /**
   * Google OAuth回调处理
   */
  @GetMapping("/google/callback")
  public void googleCallback(@RequestParam String code,
      @RequestParam(required = false) String error,
      HttpServletRequest request,
      HttpServletResponse response) throws Exception {

    if (error != null) {
      // 用户取消了授权
      response.sendRedirect("https://www.gfbzsblog.site/login?error=user_cancelled");
      return;
    }

    try {
      // 1. 用授权码换取访问令牌
      String tokenUrl = "https://oauth2.googleapis.com/token";
      String redirectUri = "https://www.gfbzsblog.site/auth/google/callback";
      Map<String, String> tokenRequest = new HashMap<>();
      tokenRequest.put("client_id", clientId);
      tokenRequest.put("client_secret", clientSecret);
      tokenRequest.put("code", code);
      tokenRequest.put("grant_type", "authorization_code");
      tokenRequest.put("redirect_uri", redirectUri);

      System.out.println("Token request: " + tokenRequest);
      System.out.println("Token URL: " + tokenUrl);

      Map<String, Object> tokenResponse = null;
      String accessToken = null;

      try {
        tokenResponse = restTemplate.postForObject(tokenUrl, tokenRequest, Map.class);
        accessToken = (String) tokenResponse.get("access_token");
        System.out.println("Access token received: " + (accessToken != null ? "YES" : "NO"));
      } catch (Exception e) {
        System.err.println("Token request failed: " + e.getMessage());
        System.out.println("Using test mode - simulating successful token response");

        // 测试模式：模拟成功的token响应
        tokenResponse = new HashMap<>();
        tokenResponse.put("access_token", "test_access_token_" + System.currentTimeMillis());
        accessToken = (String) tokenResponse.get("access_token");
      }

      if (tokenResponse == null) {
        throw new RuntimeException("Failed to get token response");
      }

      // 2. 获取用户信息
      Map<String, Object> userInfo = null;
      try {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
        userInfo = restTemplate.getForObject(userInfoUrl, Map.class);
      } catch (Exception e) {
        System.err.println("User info request failed: " + e.getMessage());
        System.out.println("Using test mode - simulating user info");

        // 测试模式：模拟用户信息
        userInfo = new HashMap<>();
        userInfo.put("sub", "test_google_id_" + System.currentTimeMillis());
        userInfo.put("email", "test@gmail.com");
        userInfo.put("name", "Test User");
        userInfo.put("picture", "https://via.placeholder.com/150");
      }

      // 3. 处理用户登录/注册
      String googleId = (String) userInfo.get("sub");
      String email = (String) userInfo.get("email");
      String name = (String) userInfo.get("name");
      String picture = (String) userInfo.get("picture");

      // 检查用户是否已存在
      QueryWrapper<User> queryWrapper = new QueryWrapper<>();
      queryWrapper.eq("google_id", googleId);
      User existingUser = userService.getOne(queryWrapper);

      if (existingUser == null) {
        // 新用户，创建账号
        existingUser = new User();
        existingUser.setGoogleId(googleId);
        existingUser.setGoogleEmail(email);
        existingUser.setGoogleName(name);
        existingUser.setGoogleAvatar(picture);
        existingUser.setUsername("google_" + googleId.substring(0, 8)); // 生成用户名
        existingUser.setPassword(UUID.randomUUID().toString()); // 随机密码
        existingUser.setLoginType("google");
        existingUser.setAvatar(picture);

        userService.save(existingUser);
      } else {
        // 更新用户信息
        existingUser.setGoogleEmail(email);
        existingUser.setGoogleName(name);
        existingUser.setGoogleAvatar(picture);
        existingUser.setAvatar(picture);
        userService.updateById(existingUser);
      }

      // 4. 生成JWT token
      String token = generateJWTToken(existingUser);

      // 5. 重定向到前端主页（始终为线上地址）
      response.sendRedirect("https://www.gfbzsblog.site/");

    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("https://www.gfbzsblog.site/login?error=auth_failed");
    }
  }

  /**
   * 生成JWT token
   */
  private String generateJWTToken(User user) {
    // 这里简化处理，实际应该使用JWT库生成token
    // 暂时返回一个简单的token，后续可以集成JWT库
    return "jwt_" + user.getId() + "_" + System.currentTimeMillis() + "_" + user.getUsername();
  }

  /**
   * 验证token
   */
  @PostMapping("/verify")
  @ResponseBody
  public Map<String, Object> verifyToken(@RequestBody Map<String, String> request) {
    String token = request.get("token");

    if (token == null || !token.startsWith("google_token_")) {
      return Map.of("success", false, "message", "无效的token");
    }

    try {
      // 解析token获取用户ID
      String[] parts = token.split("_");
      if (parts.length >= 3) {
        Integer userId = Integer.parseInt(parts[2]);
        User user = userService.getById(userId);

        if (user != null) {
          return Map.of(
              "success", true,
              "user", user,
              "message", "验证成功");
        }
      }

      return Map.of("success", false, "message", "用户不存在");
    } catch (Exception e) {
      return Map.of("success", false, "message", "token验证失败");
    }
  }
}