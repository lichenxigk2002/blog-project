package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Admin;
import com.example.blogbackend.service.IAdminService;
import com.example.blogbackend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private IAdminService adminService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        Map<String, Object> result = new HashMap<>();

        // 参数校验
        String username = loginData.get("username");
        String password = loginData.get("password");

        if (username == null || username.trim().isEmpty()) {
            result.put("code", 1);
            result.put("msg", "用户名不能为空");
            return result;
        }

        if (password == null || password.trim().isEmpty()) {
            result.put("code", 1);
            result.put("msg", "密码不能为空");
            return result;
        }

        try {
            Admin admin = adminService.findByUsername(username);
            if (admin == null) {
                logger.warn("Login attempt failed: User not found - username: {}", username);
                result.put("code", 1);
                result.put("msg", "用户名或密码错误");
                return result;
            }

            if (!admin.getPassword().equals(password)) {
                logger.warn("Login attempt failed: Invalid password - username: {}", username);
                result.put("code", 1);
                result.put("msg", "用户名或密码错误");
                return result;
            }

            // 登录成功
            String token = JwtUtil.generateToken(admin.getId(), admin.getUsername());
            logger.info("Login successful - username: {}", username);
            result.put("code", 0);
            result.put("msg", "登录成功");
            result.put("token", token);

        } catch (Exception e) {
            logger.error("Login error: ", e);
            result.put("code", 1);
            result.put("msg", "登录失败，请稍后重试");
        }

        return result;
    }
}