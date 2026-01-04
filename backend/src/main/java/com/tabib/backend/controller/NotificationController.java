package com.tabib.backend.controller;

import com.tabib.backend.entity.Notification;
import com.tabib.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // 1. GET ALL (For Admin)
    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // 2. GET BY USER ID (User checks their own inbox)
    @GetMapping("/user/{userId}")
    public List<Notification> getByUserId(@PathVariable Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // 3. CREATE NOTIFICATION (System sends alert)
    @PostMapping
    public Notification createNotification(@RequestBody Notification notification) {
        // Default to unread if not specified
        if (notification.getStatus() == null) {
            notification.setStatus("unread");
        }
        return notificationRepository.save(notification);
    }

    // 4. UPDATE (Mark as read)
    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable Long id, @RequestBody Notification details) {
        Optional<Notification> optional = notificationRepository.findById(id);

        if (optional.isPresent()) {
            Notification existing = optional.get();
            existing.setMessage(details.getMessage());
            existing.setType(details.getType());
            existing.setStatus(details.getStatus()); // e.g., change 'unread' to 'read'

            return ResponseEntity.ok(notificationRepository.save(existing));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. DELETE NOTIFICATION
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok("Notification deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}