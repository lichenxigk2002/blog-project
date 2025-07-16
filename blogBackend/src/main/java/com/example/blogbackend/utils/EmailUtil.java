package com.example.blogbackend.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String FROM_PERSONAL = "\"孤芳不自赏\" <";

    // 1. 发送订阅成功邮件（HTML模板）
    public void sendSubscribeSuccessMail(String to, String name, String unsubscribeToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            Context context = new Context();
            context.setVariable("unsubscribeToken", unsubscribeToken);
            context.setVariable("name", name);
            context.setVariable("email", to);
            String html = templateEngine.process("emailSubscribeSuccess.html", context);
            helper.setFrom(FROM_PERSONAL + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject("欢迎订阅孤芳不自赏的博客");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 2. 发送新文章推送邮件（HTML模板）
    public void sendArticleNotifyMail(String to, String name, String title, String summary, String articleId,
            String unsubscribeToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("title", title);
            context.setVariable("summary", summary);
            context.setVariable("articleId", articleId);
            context.setVariable("unsubscribeToken", unsubscribeToken);
            String html = templateEngine.process("emailArticleNotify.html", context);
            helper.setFrom(FROM_PERSONAL + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject("新文章发布：" + title);
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 3. 发送验证码邮件（HTML模板）
    public void sendVerificationCodeMail(String to, String code) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(FROM_PERSONAL + fromEmail + ">");
            helper.setTo(to);
            helper.setSubject("您的验证码");

            // 使用模板渲染验证码内容
            Context context = new Context();
            context.setVariable("code", code);
            String html = templateEngine.process("emailVerificationCode.html", context);
            helper.setText(html, true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 4. 发送新友链申请通知邮件（HTML模板）
    public void sendNewFriendLinkMail(String name, String url, String description, String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("url", url);
            context.setVariable("description", description);
            context.setVariable("email", email);
            String html = templateEngine.process("emailNewFriendLink.html", context);
            helper.setFrom(FROM_PERSONAL + fromEmail + ">");
            helper.setTo("624787243@qq.com");
            helper.setSubject("有新的友链申请啦！");
            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}