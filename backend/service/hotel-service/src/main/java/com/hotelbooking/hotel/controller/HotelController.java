package com.hotelbooking.hotel.controller;

import com.hotelbooking.hotel.entity.Hotel;
import com.hotelbooking.hotel.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public Hotel createHotel(@RequestBody Hotel hotel, Authentication auth) {
        return hotelService.createHotel(hotel, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public Hotel updateHotel(@PathVariable UUID id, @RequestBody Hotel hotel, Authentication auth) {
        return hotelService.updateHotel(id, hotel, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public String deleteHotel(@PathVariable UUID id, Authentication auth) {
        hotelService.deleteHotel(id, auth.getName());
        return "Hotel deleted successfully";
    }

    @GetMapping("/{id}")
    public Hotel getHotel(@PathVariable UUID id) {
        return hotelService.getHotel(id);
    }

    @GetMapping
    public List<Hotel> getHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank())
            return hotelService.searchHotels(search, page, size);
        return hotelService.getAllHotels(page, size);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Hotel> getMyHotels(Authentication auth) {
        return hotelService.getHotelsByManager(auth.getName());
    }
}
