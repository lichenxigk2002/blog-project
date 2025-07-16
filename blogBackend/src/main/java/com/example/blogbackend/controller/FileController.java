package com.example.blogbackend.controller;

import com.example.blogbackend.utils.CosUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class FileController {
  @Autowired
  private CosUtil cosUtil;

  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
    try {
      String fileUrl = cosUtil.uploadFile(file);
      Map<String, Object> response = new HashMap<>();
      response.put("code", 200);
      response.put("url", fileUrl);
      response.put("message", "上传成功");
      return ResponseEntity.ok(response);
    } catch (IOException e) {
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("code", 400);
      errorResponse.put("message", "文件上传失败：" + e.getMessage());
      return ResponseEntity.badRequest().body(errorResponse);
    }
  }

  @DeleteMapping("/delete")
  public ResponseEntity<?> deleteFile(@RequestParam("fileUrl") String fileUrl) {
    try {
      cosUtil.deleteFile(fileUrl);
      return ResponseEntity.ok().body("文件删除成功");
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("文件删除失败：" + e.getMessage());
    }
  }
}