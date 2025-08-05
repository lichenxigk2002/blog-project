package com.example.blogbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class WebSocketTestController {

  @GetMapping("/websocket")
  public String testWebSocket() {
    return "WebSocket 端点测试成功！";
  }
}