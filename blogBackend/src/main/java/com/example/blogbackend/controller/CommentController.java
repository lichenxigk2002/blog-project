package com.example.blogbackend.controller;

import com.example.blogbackend.dto.CommentDTO;
import com.example.blogbackend.entity.Comment;
import com.example.blogbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> addComment(@RequestBody Comment comment) {
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
}