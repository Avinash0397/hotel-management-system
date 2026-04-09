package com.hotelbooking.hotel.service;

import com.hotelbooking.hotel.entity.Review;
import com.hotelbooking.hotel.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public Review addReview(Review review, String userEmail) {
        review.setUserEmail(userEmail);
        if (review.getRating() < 1 || review.getRating() > 5)
            throw new RuntimeException("Rating must be between 1 and 5");
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByHotel(UUID hotelId) {
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
    }

    public Double getAverageRating(UUID hotelId) {
        Double avg = reviewRepository.avgRatingByHotelId(hotelId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    public void deleteReview(UUID id, String userEmail) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUserEmail().equals(userEmail))
            throw new RuntimeException("Not authorized");
        reviewRepository.delete(review);
    }
}
