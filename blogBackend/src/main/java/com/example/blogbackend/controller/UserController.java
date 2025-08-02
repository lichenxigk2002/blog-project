package com.example.blogbackend.controller;

import com.example.blogbackend.dto.UserDTO;
import com.example.blogbackend.entity.User;
import com.example.blogbackend.service.IUserService;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class UserController {
    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    public Result login(@RequestBody User user) {
        return userService.login(user);
    }

    @PostMapping("/register")
    public Result register(@RequestBody UserDTO userDTO) {
        return userService.register(userDTO);
    }

    @GetMapping("/list")
    public Result getUserList() {
        System.out.println("Received request for user list");
        Result result = userService.getUserList();
        System.out.println("User list response: " + result);
        return result;
    }

    @GetMapping("/{id}")
    public Result getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public Result<User> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> userData) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.build(null, ResultCodeEnum.NOTLOGIN);
        }
        if (userData.containsKey("username")) {
            user.setUsername((String) userData.get("username"));
        }
        if (userData.containsKey("avatar")) {
            user.setAvatar((String) userData.get("avatar"));
        }
        if (userData.containsKey("phone")) {
            user.setPhone((String) userData.get("phone"));
        }
        userService.updateById(user);
        return Result.ok(user);
    }

    @DeleteMapping("/{id}")
    public Result deleteUser(@PathVariable Integer id) {
        return userService.deleteUser(id);
    }

    @DeleteMapping("/{id}/email")
    public Result<User> unbindEmail(@PathVariable Integer id) {
        User user = userService.getById(id);
        if (user == null) {
            return Result.build(null, ResultCodeEnum.NOTLOGIN);
        }
        user.setEmailAccount(null);
        userService.updateById(user);
        return Result.ok(user);
    }

    @PutMapping("/{id}/password")
    public Result<User> changePassword(@PathVariable Integer id, @RequestBody Map<String, String> passwordData) {
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        if (oldPassword == null || newPassword == null || oldPassword.trim().isEmpty()
                || newPassword.trim().isEmpty()) {
            return Result.build(null, ResultCodeEnum.ARGUMENT_VALID_ERROR);
        }

        User user = userService.getById(id);
        if (user == null) {
            return Result.build(null, ResultCodeEnum.NOTLOGIN);
        }

        // 验证旧密码
        if (!user.getPassword().equals(oldPassword)) {
            return Result.build(null, ResultCodeEnum.PASSWORD_ERROR);
        }

        // 更新密码
        user.setPassword(newPassword);
        userService.updateById(user);

        return Result.ok(user);
    }
}
