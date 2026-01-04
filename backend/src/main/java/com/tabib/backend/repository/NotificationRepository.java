package com.tabib.backend.repository;

import com.tabib.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Find notifications for a specific user
    List<Notification> findByUserId(Long userId);
    
    // Optional: Find only unread notifications for a user
    List<Notification> findByUserIdAndStatus(Long userId, String status);
}