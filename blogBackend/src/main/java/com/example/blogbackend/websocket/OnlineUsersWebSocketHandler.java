package com.example.blogbackend.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OnlineUsersWebSocketHandler extends TextWebSocketHandler {

  private final ConcurrentHashMap<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

  @Override
  public void afterConnectionEstablished(WebSocketSession session) {
    sessions.put(session.getId(), session);
    broadcastOnlineUsers();
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
    sessions.remove(session.getId());
    broadcastOnlineUsers();
  }

  private void broadcastOnlineUsers() {
    String message = String.format("{\"type\":\"online_users\",\"count\":%d}", sessions.size());
    sessions.values().forEach(session -> {
      try {
        if (session.isOpen()) {
          session.sendMessage(new TextMessage(message));
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
    });
  }
}