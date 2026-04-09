package com.hotelbooking.hotel.repository;

import com.hotelbooking.hotel.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {
    List<Amenity> findByHotelId(UUID hotelId);
    void deleteByHotelId(UUID hotelId);
}
