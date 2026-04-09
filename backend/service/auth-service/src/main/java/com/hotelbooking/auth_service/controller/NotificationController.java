package com.hotelbooking.auth_service.controller;

import com.hotelbooking.auth_service.entity.Notification;
import com.hotelbooking.auth_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getMyNotifications(Authentication auth) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(auth.getName());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication auth) {
        return Map.of("count", notificationRepository.countByUserEmailAndReadFalse(auth.getName()));
    }

    @PutMapping("/{id}/read")
    public Notification markRead(@PathVariable UUID id, Authentication auth) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    @PutMapping("/read-all")
    public Map<String, String> markAllRead(Authentication auth) {
        List<Notification> unread = notificationRepository
                .findByUserEmailOrderByCreatedAtDesc(auth.getName())
                .stream().filter(n -> !n.getRead()).toList();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return Map.of("message", "All notifications marked as read");
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteNotification(@PathVariable UUID id) {
        notificationRepository.deleteById(id);
        return Map.of("message", "Deleted");
    }

    // Internal endpoint to create notifications (called by other services)
    @PostMapping("/create")
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationRepository.save(notification);
    }
}
