package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author author
 * @since 2025-07-11
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("system_settings")
public class SystemSettings implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    @TableField("comments_enabled")
    private Boolean commentsEnabled;

    @TableField("auto_save_enabled")
    private Boolean autoSaveEnabled;

    @TableField("user_registration")
    private Boolean userRegistration;

    @TableField("max_upload_size")
    private Integer maxUploadSize;

    @TableField("allow_html_in_markdown")
    private Boolean allowHtmlInMarkdown;

    @TableField("email_notifications")
    private Boolean emailNotifications;

    @TableField("new_article_notification")
    private Boolean newArticleNotification;

    @TableField("comment_notification")
    private Boolean commentNotification;

    @TableField("system_maintenance")
    private Boolean systemMaintenance;

    @TableField("theme")
    private String theme;

    @TableField("language")
    private String language;

    @TableField("sidebar_collapsed")
    private Boolean sidebarCollapsed;

    @TableField("show_breadcrumb")
    private Boolean showBreadcrumb;

    @TableField("show_watermark")
    private Boolean showWatermark;

    @TableField("server_port")
    private Integer serverPort;

    @TableField("database_status")
    private String databaseStatus;

    @TableField("upload_path")
    private String uploadPath;

    @TableField("version")
    private String version;

    @TableField("last_update")
    private LocalDateTime lastUpdate;

    @TableField("show_admin_login_entry")
    private Boolean showAdminLoginEntry;


}
