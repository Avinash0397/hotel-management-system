package com.hotelbooking.hotel.service;

import com.hotelbooking.hotel.entity.Amenity;
import com.hotelbooking.hotel.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public Amenity addAmenity(Amenity amenity) {
        amenity.setAvailable(true);
        return amenityRepository.save(amenity);
    }

    public List<Amenity> getAmenitiesByHotel(UUID hotelId) {
        return amenityRepository.findByHotelId(hotelId);
    }

    public Amenity updateAmenity(UUID id, Amenity updated) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));
        amenity.setName(updated.getName());
        amenity.setIcon(updated.getIcon());
        amenity.setAvailable(updated.getAvailable());
        return amenityRepository.save(amenity);
    }

    public void deleteAmenity(UUID id) {
        amenityRepository.deleteById(id);
    }
}
