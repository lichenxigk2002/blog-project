package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.User;
import com.example.blogbackend.dto.UserDTO;
import com.example.blogbackend.mapper.UserMapper;
import com.example.blogbackend.service.IUserService;
import com.example.blogbackend.service.ISmsService;
import com.example.blogbackend.utils.JwtHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * @author .example.blogbackend.blogbackend
 * @description 针对表【news_user】的数据库操作Service实现
 * @createDate 2025-04-06 16:24:18
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
        implements IUserService {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private ISmsService smsService;

    @Autowired
    private JwtHelper jwtHelper;

    @Override
    public Result login(User user) {
        // 添加调试日志
        System.out.println(
                "Login request received - Username: " + user.getUsername() + ", Password: " + user.getPassword());

        // 验证用户名和密码
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return Result.build(null, 400, "用户名不能为空");
        }
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return Result.build(null, 400, "密码不能为空");
        }

        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, user.getUsername());
        User existingUser = userMapper.selectOne(queryWrapper);

        if (existingUser == null) {
            return Result.build(null, 400, "用户不存在");
        }

        // 添加调试日志
        System.out.println("Found user in database - Username: " + existingUser.getUsername() + ", Password: "
                + existingUser.getPassword());

        if (!existingUser.getPassword().equals(user.getPassword())) {
            return Result.build(null, 400, "密码错误");
        }

        // 生成JWT token - 与邮箱登录保持一致
        String token = jwtHelper.createToken(existingUser.getId().longValue());

        // 创建一个不包含密码的用户对象返回
        User responseUser = new User();
        responseUser.setId(existingUser.getId());
        responseUser.setUsername(existingUser.getUsername());
        responseUser.setAvatar(existingUser.getAvatar());
        responseUser.setPhone(existingUser.getPhone());
        responseUser.setLoginType(existingUser.getLoginType());

        // 返回包含token和用户信息的响应 - 与邮箱登录保持一致
        Map<String, Object> data = Map.of(
                "token", token,
                "user", responseUser);

        return Result.ok(data);
    }

    @Override
    public Result register(UserDTO userDTO) {
        // 检查用户名是否已存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, userDTO.getUsername());
        User existingUser = userMapper.selectOne(queryWrapper);

        if (existingUser != null) {
            return Result.build(null, 400, "用户名已存在");
        }

        // 验证密码
        if (userDTO.getPassword() == null || userDTO.getPassword().trim().isEmpty()) {
            return Result.build(null, 400, "密码不能为空");
        }

        // 创建新用户
        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());
        newUser.setPassword(userDTO.getPassword());

        // 保存用户
        userMapper.insert(newUser);

        // 生成JWT token - 与邮箱登录保持一致
        String token = jwtHelper.createToken(newUser.getId().longValue());

        // 返回用户信息（不包含密码）
        User responseUser = new User();
        responseUser.setId(newUser.getId());
        responseUser.setUsername(newUser.getUsername());
        responseUser.setLoginType(newUser.getLoginType());

        // 返回包含token和用户信息的响应 - 与邮箱登录保持一致
        Map<String, Object> data = Map.of(
                "token", token,
                "user", responseUser);

        return Result.ok(data);
    }

    @Override
    public Result loginByPhone(String phone, String code) {
        // 验证验证码
        Result verifyResult = smsService.verifyCode(phone, code, "login");
        if (verifyResult.getCode() != 200) {
            return verifyResult;
        }

        // 查询用户
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, phone);
        User user = userMapper.selectOne(queryWrapper);

        if (user == null) {
            return Result.build(null, 400, "该手机号未注册");
        }

        // 更新登录方式
        user.setLoginType("sms");
        userMapper.updateById(user);

        // 生成JWT token - 与邮箱登录保持一致
        String token = jwtHelper.createToken(user.getId().longValue());

        // 返回用户信息（不包含密码）
        User responseUser = new User();
        responseUser.setId(user.getId());
        responseUser.setUsername(user.getUsername());
        responseUser.setPhone(user.getPhone());
        responseUser.setAvatar(user.getAvatar());
        responseUser.setLoginType(user.getLoginType());

        // 返回包含token和用户信息的响应 - 与邮箱登录保持一致
        Map<String, Object> data = Map.of(
                "token", token,
                "user", responseUser);

        return Result.ok(data);
    }

    @Override
    public Result bindPhone(Integer userId, String phone, String code) {
        // 验证验证码
        Result verifyResult = smsService.verifyCode(phone, code, "bind");
        if (verifyResult.getCode() != 200) {
            return verifyResult;
        }

        // 检查手机号是否已被绑定
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, phone);
        User existingUser = userMapper.selectOne(queryWrapper);
        if (existingUser != null) {
            return Result.build(null, 400, "该手机号已被绑定");
        }

        // 更新用户手机号信息
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Result.build(null, 400, "用户不存在");
        }

        user.setPhone(phone);
        user.setPhoneVerified(true);
        user.setPhoneBindTime(LocalDateTime.now());
        userMapper.updateById(user);

        return Result.ok("手机号绑定成功");
    }

    @Override
    public Result getUserList() {
        try {
            System.out.println("Getting user list from database...");
            List<User> users = userMapper.selectList(null);
            System.out.println("Found " + users.size() + " users");

            // 移除密码字段
            users.forEach(user -> {
                user.setPassword(null);
                System.out.println("User: " + user.getUsername());
            });

            return Result.ok(users);
        } catch (Exception e) {
            System.err.println("Error getting user list: " + e.getMessage());
            e.printStackTrace();
            return Result.build(null, 500, "获取用户列表失败: " + e.getMessage());
        }
    }

    @Override
    public Result getUserById(Integer id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.build(null, 400, "用户不存在");
        }
        user.setPassword(null);
        return Result.ok(user);
    }

    @Override
    public Result updateUser(Integer id, UserDTO userDTO) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.build(null, 400, "用户不存在");
        }

        // 更新用户信息
        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }
        if (userDTO.getPhone() != null) {
            user.setPhone(userDTO.getPhone());
        }
        if (userDTO.getLoginType() != null) {
            user.setLoginType(userDTO.getLoginType());
        }

        userMapper.updateById(user);
        return Result.ok("更新成功");
    }

    @Override
    public Result deleteUser(Integer id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            return Result.build(null, 400, "用户不存在");
        }
        userMapper.deleteById(id);
        return Result.ok("删除成功");
    }
}
