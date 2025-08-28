package com.example.blogbackend.controller;

import com.example.blogbackend.dto.CommentDTO;
import com.example.blogbackend.entity.Comment;
import com.example.blogbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @GetMapping("/article/{articleId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByArticleId(@PathVariable Integer articleId) {
        List<CommentDTO> comments = commentService.getCommentsByArticleId(articleId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Comment comment, HttpServletRequest request) {
        // 获取用户IP地址
        String ipAddress = getClientIPAddress(request);

        // 获取IP地理位置信息
        if (ipAddress != null && !ipAddress.isEmpty()) {
            try {
                String locationInfo = getIPLocation(ipAddress);
                if (locationInfo != null) {
                    comment.setIpLocation(locationInfo);
                }

                // 根据IP判断网络运营商（简单判断）
                String operator = getNetworkOperator(ipAddress);
                if (operator != null) {
                    comment.setNetworkOperator(operator);
                }
            } catch (Exception e) {
                // 如果获取地理位置失败，不影响评论发布
                System.err.println("获取IP地理位置失败: " + e.getMessage());
            }
        }

        boolean success = commentService.addComment(comment);
        if (success) {
            return ResponseEntity.ok("评论添加成功");
        }
        return ResponseEntity.badRequest().body("评论添加失败");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {
        boolean success = commentService.deleteComment(id);
        if (success) {
            return ResponseEntity.ok("评论删除成功");
        }
        return ResponseEntity.badRequest().body("评论删除失败");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Integer id, @RequestBody Comment comment) {
        comment.setId(id);
        boolean success = commentService.updateComment(comment);
        if (success) {
            return ResponseEntity.ok("评论更新成功");
        }
        return ResponseEntity.badRequest().body("评论更新失败");
    }

    @GetMapping("/all")
    public ResponseEntity<List<CommentDTO>> getAllComments() {
        List<CommentDTO> comments = commentService.getAllComments();
        return ResponseEntity.ok(comments);
    }

    /**
     * 获取客户端真实IP地址
     */
    private String getClientIPAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 如果是多个IP，取第一个
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }

    /**
     * 获取IP地理位置信息
     */
    private String getIPLocation(String ipAddress) {
        try {
            // 使用国内的免费IP地理位置API
            String url = "https://whois.pconline.com.cn/ipJson.jsp?ip=" + ipAddress + "&json=true";
            URL apiUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) apiUrl.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "GBK"));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // 解析JSON响应
            String responseStr = response.toString();
            if (responseStr.contains("\"pro\":") && responseStr.contains("\"city\":")) {
                String pro = extractJsonValue(responseStr, "pro");
                String city = extractJsonValue(responseStr, "city");

                if (pro != null && city != null && !pro.equals(city)) {
                    return pro + " " + city;
                } else if (pro != null) {
                    return pro;
                }
            }
        } catch (Exception e) {
            System.err.println("获取IP地理位置失败: " + e.getMessage());
        }
        return null;
    }

    /**
     * 根据IP地址判断网络运营商（简单判断）
     */
    private String getNetworkOperator(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return null;
        }

        // 简单的IP段判断（实际项目中建议使用更准确的IP库）
        if (ipAddress.startsWith("10.") || ipAddress.startsWith("192.168.") || ipAddress.startsWith("172.")) {
            return "内网";
        }

        // 中国电信IP段（部分）
        if (ipAddress.startsWith("59.") || ipAddress.startsWith("61.") || ipAddress.startsWith("218.") ||
                ipAddress.startsWith("220.") || ipAddress.startsWith("221.") || ipAddress.startsWith("222.")) {
            return "电信";
        }

        // 中国联通IP段（部分）
        if (ipAddress.startsWith("60.") || ipAddress.startsWith("61.") || ipAddress.startsWith("202.") ||
                ipAddress.startsWith("203.") || ipAddress.startsWith("210.") || ipAddress.startsWith("211.")) {
            return "联通";
        }

        // 中国移动IP段（部分）
        if (ipAddress.startsWith("120.") || ipAddress.startsWith("121.") || ipAddress.startsWith("122.") ||
                ipAddress.startsWith("123.") || ipAddress.startsWith("124.") || ipAddress.startsWith("125.")) {
            return "移动";
        }

        return "未知";
    }

    /**
     * 从JSON字符串中提取指定字段的值
     */
    private String extractJsonValue(String json, String field) {
        Pattern pattern = Pattern.compile("\"" + field + "\":\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(json);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }
}