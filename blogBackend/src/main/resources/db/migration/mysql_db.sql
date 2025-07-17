-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: my_blog
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `username` varchar(50) NOT NULL COMMENT '管理员账号',
                         `password` varchar(255) NOT NULL COMMENT '密码',
                         `last_login` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
                         `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员表（仅基础登录）';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ai_chat_messages`
--

DROP TABLE IF EXISTS `ai_chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_chat_messages` (
                                    `id` int NOT NULL AUTO_INCREMENT,
                                    `session_id` int NOT NULL COMMENT '所属会话ID',
                                    `role` enum('user','assistant') NOT NULL COMMENT '消息角色',
                                    `content` text NOT NULL COMMENT '消息内容',
                                    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    KEY `session_id` (`session_id`),
                                    CONSTRAINT `ai_chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `ai_chat_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='AI对话消息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ai_chat_sessions`
--

DROP TABLE IF EXISTS `ai_chat_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ai_chat_sessions` (
                                    `id` int NOT NULL AUTO_INCREMENT,
                                    `user_id` int NOT NULL COMMENT '关联用户ID',
                                    `title` varchar(100) DEFAULT '新对话' COMMENT '对话标题（自动生成）',
                                    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    KEY `user_id` (`user_id`),
                                    CONSTRAINT `ai_chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='AI对话会话表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `article_tags`
--

DROP TABLE IF EXISTS `article_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article_tags` (
                                `article_id` int NOT NULL,
                                `tag_id` int NOT NULL,
                                PRIMARY KEY (`article_id`,`tag_id`),
                                KEY `tag_id` (`tag_id`),
                                CONSTRAINT `article_tags_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
                                CONSTRAINT `article_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
                            `id` int NOT NULL AUTO_INCREMENT COMMENT '文章ID，自增主键',
                            `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章标题',
                            `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章URL友好名称（用于SEO）',
                            `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Markdown格式的原始内容',
                            `html_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '转换后的HTML内容（可选）',
                            `excerpt` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '文章摘要（可自动生成或手动编写）',
                            `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封面图URL',
                            `images` json DEFAULT NULL COMMENT '文章内使用的所有图片路径数组',
                            `author_id` int NOT NULL COMMENT '作者ID（可以先存用户名字符串，后期关联用户表）',
                            `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft' COMMENT '文章状态',
                            `post_type` enum('post','page','thought','diary') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'post' COMMENT '文章类型',
                            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                            `published_at` timestamp NULL DEFAULT NULL COMMENT '发布时间',
                            `view_count` int DEFAULT '0' COMMENT '浏览量',
                            `like_count` int DEFAULT '0' COMMENT '点赞数',
                            `reading_time` int DEFAULT NULL COMMENT '预计阅读时长（分钟）',
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `slug` (`slug`),
                            KEY `idx_author` (`author_id`),
                            KEY `idx_status_published` (`status`,`published_at`),
                            KEY `idx_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='博客文章表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bulletinboard`
--

DROP TABLE IF EXISTS `bulletinboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bulletinboard` (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '留言者姓名',
                                 `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '留言者邮箱',
                                 `gender` enum('小哥哥','小姐姐') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '性别',
                                 `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '留言内容',
                                 `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '留言时间',
                                 `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                 `status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'approved' COMMENT '留言状态：待审核、已通过、已拒绝',
                                 `reply` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '管理员回复内容',
                                 `reply_time` timestamp NULL DEFAULT NULL COMMENT '回复时间',
                                 `is_pinned` tinyint(1) DEFAULT '0' COMMENT '是否置顶：0-否，1-是',
                                 `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像URL',
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='留言板';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `article_id` int NOT NULL COMMENT '关联的文章ID',
                            `user_id` int NOT NULL COMMENT '评论用户ID',
                            `parent_id` int DEFAULT NULL COMMENT '父评论ID（用于回复功能）',
                            `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
                            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            KEY `idx_article` (`article_id`),
                            KEY `idx_user` (`user_id`),
                            KEY `idx_parent` (`parent_id`),
                            CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `extensions`
--

DROP TABLE IF EXISTS `extensions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extensions` (
                              `id` int NOT NULL AUTO_INCREMENT,
                              `user_id` int NOT NULL,
                              `type` varchar(50) NOT NULL COMMENT '功能类型：bookmark/reminder等',
                              `data` json NOT NULL COMMENT '结构化数据存储',
                              `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                              PRIMARY KEY (`id`),
                              KEY `user_id` (`user_id`),
                              CONSTRAINT `extensions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户扩展功能表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friendlinks`
--

DROP TABLE IF EXISTS `friendlinks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friendlinks` (
                               `id` int NOT NULL AUTO_INCREMENT,
                               `name` varchar(100) NOT NULL,
                               `url` varchar(255) NOT NULL,
                               `avatar_url` varchar(255) DEFAULT NULL,
                               `description` text,
                               `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                               `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
                           `id` int NOT NULL AUTO_INCREMENT COMMENT '相册ID，自增主键',
                           `date` date DEFAULT NULL,
                           `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '相册标题',
                           `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '相册描述',
                           `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '相册分类',
                           `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封面图URL',
                           `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                           PRIMARY KEY (`id`),
                           KEY `idx_date` (`date`),
                           KEY `idx_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='相册表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `question_tags`
--

DROP TABLE IF EXISTS `question_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_tags` (
                                 `question_id` int NOT NULL,
                                 `tag_id` int NOT NULL,
                                 PRIMARY KEY (`question_id`,`tag_id`),
                                 KEY `tag_id` (`tag_id`),
                                 CONSTRAINT `question_tags_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE,
                                 CONSTRAINT `question_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `title` varchar(200) NOT NULL COMMENT '题目标题',
                             `content` text NOT NULL COMMENT '题目内容',
                             `difficulty` enum('easy','medium','hard') NOT NULL COMMENT '难度等级',
                             `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                             `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             `status` enum('draft','published') DEFAULT 'draft' COMMENT '状态',
                             `views` int DEFAULT '0' COMMENT '浏览次数',
                             `likes` int DEFAULT '0' COMMENT '点赞数',
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sms_codes`
--

DROP TABLE IF EXISTS `sms_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sms_codes` (
                             `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
                             `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
                             `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '验证码',
                             `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '验证码类型：login/register/reset',
                             `expire_time` datetime NOT NULL COMMENT '过期时间',
                             `used` tinyint(1) DEFAULT '0' COMMENT '是否已使用',
                             `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                             `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                             PRIMARY KEY (`id`),
                             KEY `idx_phone` (`phone`),
                             KEY `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='短信验证码记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subscribe_emails`
--

DROP TABLE IF EXISTS `subscribe_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscribe_emails` (
                                    `id` bigint NOT NULL AUTO_INCREMENT,
                                    `email` varchar(255) NOT NULL COMMENT '订阅邮箱',
                                    `subscribed` tinyint(1) DEFAULT '1' COMMENT '1:已订阅 0:已退订',
                                    `subscribe_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '订阅时间',
                                    `unsubscribe_token` varchar(64) NOT NULL COMMENT '退订唯一token',
                                    `name` varchar(255) NOT NULL,
                                    PRIMARY KEY (`id`),
                                    UNIQUE KEY `email` (`email`),
                                    KEY `idx_email` (`email`),
                                    KEY `idx_token` (`unsubscribe_token`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
                                   `id` int NOT NULL AUTO_INCREMENT,
                                   `comments_enabled` tinyint(1) NOT NULL DEFAULT '1',
                                   `auto_save_enabled` tinyint(1) NOT NULL DEFAULT '1',
                                   `user_registration` tinyint(1) NOT NULL DEFAULT '1',
                                   `max_upload_size` int NOT NULL DEFAULT '10',
                                   `allow_html_in_markdown` tinyint(1) NOT NULL DEFAULT '1',
                                   `email_notifications` tinyint(1) NOT NULL DEFAULT '1',
                                   `new_article_notification` tinyint(1) NOT NULL DEFAULT '1',
                                   `comment_notification` tinyint(1) NOT NULL DEFAULT '1',
                                   `system_maintenance` tinyint(1) NOT NULL DEFAULT '0',
                                   `theme` varchar(10) NOT NULL DEFAULT 'auto',
                                   `language` varchar(10) NOT NULL DEFAULT 'zh-CN',
                                   `sidebar_collapsed` tinyint(1) NOT NULL DEFAULT '0',
                                   `show_breadcrumb` tinyint(1) NOT NULL DEFAULT '1',
                                   `show_watermark` tinyint(1) NOT NULL DEFAULT '0',
                                   `server_port` int NOT NULL DEFAULT '3000',
                                   `database_status` varchar(20) NOT NULL DEFAULT 'connected',
                                   `upload_path` varchar(255) NOT NULL DEFAULT '/uploads',
                                   `version` varchar(20) NOT NULL DEFAULT '1.0.0',
                                   `last_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   `show_admin_login_entry` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否显示管理员登录入口',
                                   PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
                        `id` int NOT NULL AUTO_INCREMENT,
                        `name` varchar(50) NOT NULL,
                        `slug` varchar(50) NOT NULL,
                        `color` varchar(20) DEFAULT NULL COMMENT '标签颜色',
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `name` (`name`),
                        UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `thoughts`
--

DROP TABLE IF EXISTS `thoughts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thoughts` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `content` text NOT NULL COMMENT '思考内容',
                            `mood` varchar(10) DEFAULT 'neutral' COMMENT '记录时心情',
                            `location` varchar(100) DEFAULT NULL COMMENT '记录地点',
                            `tags` varchar(50) DEFAULT NULL COMMENT '标签数组["灵感","技术"]',
                            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                            `weather` varchar(50) DEFAULT NULL COMMENT '天气（如 "晴天"、"下雨"）',
                            `device` varchar(50) DEFAULT NULL COMMENT '记录设备（如 "iPhone", "MacBook"）',
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户思考记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
                         `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '加密后的密码',
                         `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
                         `phone_verified` tinyint(1) DEFAULT '0' COMMENT '手机号是否已验证',
                         `phone_bind_time` datetime DEFAULT NULL COMMENT '手机号绑定时间',
                         `login_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'password' COMMENT '登录方式：password/sms/google/github/email',
                         `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/default-avatar.png' COMMENT '头像URL',
                         `google_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Google账号唯一ID',
                         `google_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Google邮箱地址',
                         `google_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Google显示名称',
                         `google_avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Google头像URL',
                         `github_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'GitHub账号唯一ID',
                         `github_username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'GitHub用户名',
                         `github_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'GitHub邮箱地址',
                         `github_avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'GitHub头像URL',
                         `email_account` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱账号',
                         `email_verified` tinyint(1) DEFAULT '0' COMMENT '邮箱是否已验证',
                         `email_bind_time` datetime DEFAULT NULL COMMENT '邮箱绑定时间',
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `username` (`username`),
                         UNIQUE KEY `idx_phone` (`phone`),
                         UNIQUE KEY `idx_google_id` (`google_id`),
                         UNIQUE KEY `idx_github_id` (`github_id`),
                         UNIQUE KEY `idx_email_account` (`email_account`),
                         KEY `idx_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1871159358 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-17 21:40:04
