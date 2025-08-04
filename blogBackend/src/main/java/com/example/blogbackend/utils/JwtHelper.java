package com.example.blogbackend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.security.Key;
import java.util.Base64;

@Component
public class JwtHelper {
  private static final long tokenExpiration = 24 * 60 * 60 * 1000; // 24小时
  private static final String SECRET = "c2VjcmV0X2tleV9mb3JfanNvbndlYnRva2VuX2F0X2xlYXN0XzMyX2J5dGVzYWFhYmJiY2NjZGRkZWVlZmZmMTIzNDU2Nzg5MDEyMzQ1Njc4OTA=";
  private static final Key key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET));

  public String createToken(Long userId) {
    String token = Jwts.builder()
        .setSubject("USER-" + userId)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + tokenExpiration))
        .signWith(key, SignatureAlgorithm.HS512)
        .compressWith(CompressionCodecs.GZIP)
        .compact();
    return token;
  }

  public Long getUserId(String token) {
    try {
      if (token == null)
        return null;
      Jws<Claims> claimsJws = Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(token);
      Claims claims = claimsJws.getBody();
      String subject = claims.getSubject();
      return Long.parseLong(subject.split("-")[1]);
    } catch (Exception e) {
      return null;
    }
  }

  public boolean isExpiration(String token) {
    try {
      boolean isExpire = Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(token)
          .getBody()
          .getExpiration()
          .before(new Date());
      return isExpire;
    } catch (Exception e) {
      return true;
    }
  }
}