package com.hotelbooking.hotel.repository;

import com.hotelbooking.hotel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByHotelIdOrderByCreatedAtDesc(UUID hotelId);
    boolean existsByHotelIdAndUserEmail(UUID hotelId, String userEmail);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.hotelId = :hotelId")
    Double avgRatingByHotelId(@Param("hotelId") UUID hotelId);
}
