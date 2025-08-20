package com.aebdm.savclient.repository;

import com.aebdm.savclient.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}