package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Gallery;
import com.example.blogbackend.service.IGalleryService;
import com.example.blogbackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/gallery")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class GalleryController {

  private final IGalleryService galleryService;
  private final FileStorageService fileStorageService;

  @Autowired
  public GalleryController(IGalleryService galleryService, FileStorageService fileStorageService) {
    this.galleryService = galleryService;
    this.fileStorageService = fileStorageService;
  }

  @GetMapping("/list")
  public ResponseEntity<List<Gallery>> getAllGalleries() {
    List<Gallery> galleries = galleryService.getAllGalleries();
    return ResponseEntity.ok(galleries);
  }

  @GetMapping("/category/{category}")
  public ResponseEntity<List<Gallery>> getGalleriesByCategory(@PathVariable String category) {
    List<Gallery> galleries = galleryService.getGalleriesByCategory(category);
    return ResponseEntity.ok(galleries);
  }

  @GetMapping("/categories")
  public ResponseEntity<List<String>> getAllCategories() {
    List<String> categories = galleryService.getAllCategories();
    return ResponseEntity.ok(categories);
  }

  @PostMapping
  public ResponseEntity<?> addGallery(
          @RequestParam("title") String title,
          @RequestParam("description") String description,
          @RequestParam("category") String category,
          @RequestParam("date") String date,
          @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
    try {
      Gallery gallery = new Gallery();
      gallery.setTitle(title);
      gallery.setDescription(description);
      gallery.setCategory(category);
      gallery.setDate(LocalDate.parse(date.split("T")[0]));
      gallery.setCreatedAt(LocalDateTime.now());
      gallery.setUpdatedAt(LocalDateTime.now());

      if (coverImage != null && !coverImage.isEmpty()) {
        String filePath = fileStorageService.storeFile(coverImage);
        // 确保返回的路径是相对于静态资源目录的
        gallery.setCoverImage(filePath);
      }

      boolean saved = galleryService.save(gallery);
      if (saved) {
        return ResponseEntity.ok(gallery);
      } else {
        return ResponseEntity.status(500).body("添加失败");
      }
    } catch (Exception e) {
      return ResponseEntity.status(500).body("文件上传失败: " + e.getMessage());
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<?> updateGallery(
          @PathVariable Integer id,
          @RequestParam("title") String title,
          @RequestParam("description") String description,
          @RequestParam("category") String category,
          @RequestParam("date") String date,
          @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
    try {
      Gallery gallery = galleryService.getById(id);
      if (gallery == null) {
        return ResponseEntity.status(404).body("未找到该相册");
      }

      gallery.setTitle(title);
      gallery.setDescription(description);
      gallery.setCategory(category);
      gallery.setDate(LocalDate.parse(date.split("T")[0]));
      gallery.setUpdatedAt(LocalDateTime.now());

      if (coverImage != null && !coverImage.isEmpty()) {
        String filePath = fileStorageService.storeFile(coverImage);
        gallery.setCoverImage(filePath);
      }

      boolean updated = galleryService.updateById(gallery);
      if (updated) {
        return ResponseEntity.ok(gallery);
      } else {
        return ResponseEntity.status(500).body("更新失败");
      }
    } catch (Exception e) {
      return ResponseEntity.status(500).body("文件上传失败: " + e.getMessage());
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteGallery(@PathVariable Integer id) {
    boolean removed = galleryService.removeById(id);
    if (removed) {
      return ResponseEntity.ok("删除成功");
    } else {
      return ResponseEntity.status(404).body("未找到该相册");
    }
  }
}