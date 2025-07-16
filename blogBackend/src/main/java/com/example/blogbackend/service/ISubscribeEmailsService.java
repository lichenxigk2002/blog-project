package com.example.blogbackend.service;

import com.example.blogbackend.entity.SubscribeEmails;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-07-05
 */
public interface ISubscribeEmailsService extends IService<SubscribeEmails> {

  boolean subscribe(String email, String name, String baseUrl);

  boolean unsubscribe(String token);

}
