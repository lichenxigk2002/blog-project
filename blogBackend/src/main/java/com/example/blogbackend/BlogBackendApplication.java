package com.example.blogbackend;

import io.github.cdimascio.dotenv.Dotenv;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

@MapperScan("com.example.blogbackend.mapper")
@SpringBootApplication
public class BlogBackendApplication {

    public static void main(String[] args) {
        try {
            // 尝试加载 .env 文件
            Dotenv dotenv = Dotenv.configure()
                    .directory(".")
                    .ignoreIfMissing() // 如果文件不存在则忽略
                    .load();

            // 设置环境变量
            dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
        } catch (Exception e) {
            // 如果加载失败，使用默认值
            System.out.println("Warning: .env file not found, using default values");
        }

        SpringApplication.run(BlogBackendApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // 配置超时设置
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000); // 10秒连接超时
        factory.setReadTimeout(30000); // 30秒读取超时
        restTemplate.setRequestFactory(factory);

        return restTemplate;
    }

}
