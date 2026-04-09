package com.hotelbooking.hotel.service;

import com.hotelbooking.hotel.entity.Hotel;
import com.hotelbooking.hotel.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    public Hotel createHotel(Hotel hotel, String managerEmail) {
        hotel.setManagerEmail(managerEmail);
        hotel.setActive(true);
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(UUID id, Hotel updated, String managerEmail) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getManagerEmail().equals(managerEmail))
            throw new RuntimeException("You are not the owner of this hotel");

        hotel.setName(updated.getName());
        hotel.setCity(updated.getCity());
        hotel.setAddress(updated.getAddress());
        if (updated.getActive() != null) hotel.setActive(updated.getActive());
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(UUID id, String managerEmail) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        if (!hotel.getManagerEmail().equals(managerEmail))
            throw new RuntimeException("You are not the owner of this hotel");

        hotelRepository.delete(hotel);
    }

    public Hotel getHotel(UUID id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    public List<Hotel> getAllHotels(int page, int size) {
        return hotelRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    public List<Hotel> searchHotels(String query, int page, int size) {
        return hotelRepository.searchHotels(query, PageRequest.of(page, size)).getContent();
    }

    public List<Hotel> getHotelsByManager(String managerEmail) {
        return hotelRepository.findByManagerEmail(managerEmail);
    }
}
