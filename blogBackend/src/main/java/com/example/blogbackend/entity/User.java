package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("users")
public class User {
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    private String username;

    private String password;

    private String phone;

    private Boolean phoneVerified;

    private LocalDateTime phoneBindTime;

    private String loginType;

    private String avatar;

    // Google账号相关字段
    private String googleId;
    private String googleEmail;
    private String googleName;
    private String googleAvatar;

    // GitHub账号相关字段
    private String githubId;
    private String githubUsername;
    private String githubEmail;
    private String githubAvatar;

    // 邮箱账号相关字段
    @TableField(value = "email_account", updateStrategy = FieldStrategy.IGNORED)
    private String emailAccount;
    private Boolean emailVerified;
    private LocalDateTime emailBindTime;
}