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
 * @since 2025-07-05
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("subscribe_emails")
public class SubscribeEmails implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 订阅邮箱
     */
    @TableField("email")
    private String email;

    /**
     * 称呼
     */
    @TableField("name")
    private String name;
    /**
     * 1:已订阅 0:已退订
     */
    @TableField("subscribed")
    private Boolean subscribed;

    /**
     * 订阅时间
     */
    @TableField("subscribe_time")
    private LocalDateTime subscribeTime;

    /**
     * 退订唯一token
     */
    @TableField("unsubscribe_token")
    private String unsubscribeToken;

}
