package com.hotelbooking.hotel.controller;

import com.hotelbooking.hotel.entity.Amenity;
import com.hotelbooking.hotel.service.AmenityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/amenities")
@RequiredArgsConstructor
public class AmenityController {

    private final AmenityService amenityService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public Amenity addAmenity(@RequestBody Amenity amenity) {
        return amenityService.addAmenity(amenity);
    }

    @GetMapping("/hotel/{hotelId}")
    public List<Amenity> getAmenities(@PathVariable UUID hotelId) {
        return amenityService.getAmenitiesByHotel(hotelId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public Amenity updateAmenity(@PathVariable UUID id, @RequestBody Amenity amenity) {
        return amenityService.updateAmenity(id, amenity);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public String deleteAmenity(@PathVariable UUID id) {
        amenityService.deleteAmenity(id);
        return "Amenity deleted";
    }
}
