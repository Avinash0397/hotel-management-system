package com.hotelbooking.hotel.repository;

import com.hotelbooking.hotel.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {

    @Query("SELECT h FROM Hotel h WHERE " +
           "(:query IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(h.city) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Hotel> searchHotels(@Param("query") String query, Pageable pageable);

    List<Hotel> findByCityIgnoreCase(String city);
    List<Hotel> findByManagerEmail(String managerEmail);
    List<Hotel> findByActiveTrue();
}
