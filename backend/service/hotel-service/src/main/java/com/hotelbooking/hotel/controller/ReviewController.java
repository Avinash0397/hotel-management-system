package com.hotelbooking.hotel.controller;

import com.hotelbooking.hotel.entity.Review;
import com.hotelbooking.hotel.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public Review addReview(@RequestBody Review review, Authentication auth) {
        return reviewService.addReview(review, auth.getName());
    }

    @GetMapping("/hotel/{hotelId}")
    public List<Review> getReviews(@PathVariable UUID hotelId) {
        return reviewService.getReviewsByHotel(hotelId);
    }

    @GetMapping("/hotel/{hotelId}/rating")
    public Map<String, Object> getAverageRating(@PathVariable UUID hotelId) {
        return Map.of(
            "hotelId", hotelId,
            "averageRating", reviewService.getAverageRating(hotelId),
            "totalReviews", reviewService.getReviewsByHotel(hotelId).size()
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public String deleteReview(@PathVariable UUID id, Authentication auth) {
        reviewService.deleteReview(id, auth.getName());
        return "Review deleted";
    }
}
