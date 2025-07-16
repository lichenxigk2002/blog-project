package com.example.blogbackend.service.impl;

import com.example.blogbackend.entity.SubscribeEmails;
import com.example.blogbackend.mapper.SubscribeEmailsMapper;
import com.example.blogbackend.service.ISubscribeEmailsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import com.example.blogbackend.utils.EmailUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.Base64;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-07-05
 */
@Service
public class SubscribeEmailsServiceImpl extends ServiceImpl<SubscribeEmailsMapper, SubscribeEmails>
        implements ISubscribeEmailsService {

    @Autowired
    private EmailUtil emailUtil;

    @Transactional
    public boolean subscribe(String email, String name, String baseUrl) {
        // 校验邮箱格式
        if (email == null || !email.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")) {
            return false;
        }
        // 生成唯一token
        String token = UUID.randomUUID().toString().replace("-", "");
        // 查找是否已存在
        SubscribeEmails exist = lambdaQuery().eq(SubscribeEmails::getEmail, email).one();
        if (exist == null) {
            // 新增
            SubscribeEmails sub = new SubscribeEmails();
            sub.setEmail(email);
            sub.setName(name);
            sub.setSubscribed(true);
            sub.setSubscribeTime(java.time.LocalDateTime.now());
            sub.setUnsubscribeToken(token);
            save(sub);
        } else if (Boolean.TRUE.equals(exist.getSubscribed())) {
            // 已订阅，直接返回false或抛出自定义异常
            throw new RuntimeException("你已经订阅过啦，请勿重复订阅");
        } else {
            // 已存在则更新为已订阅
            exist.setName(name);
            exist.setSubscribed(true);
            exist.setSubscribeTime(java.time.LocalDateTime.now());
            exist.setUnsubscribeToken(token);
            updateById(exist);
        }
        // 发送订阅成功邮件
        emailUtil.sendSubscribeSuccessMail(email, name, token);
        return true;
    }

    @Transactional
    public boolean unsubscribe(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        // 尝试解码token（如果是Base64编码的）
        String decodedToken = token;
        try {
            decodedToken = new String(Base64.getDecoder().decode(token));
        } catch (Exception e) {
            // 如果不是Base64编码，直接使用原token
            decodedToken = token;
        }

        // 根据token查找订阅记录
        SubscribeEmails subscribeEmail = lambdaQuery()
                .eq(SubscribeEmails::getUnsubscribeToken, decodedToken)
                .one();

        if (subscribeEmail == null) {
            return false;
        }

        // 更新为已退订
        subscribeEmail.setSubscribed(false);
        boolean updated = updateById(subscribeEmail);

        return updated;
    }
}
