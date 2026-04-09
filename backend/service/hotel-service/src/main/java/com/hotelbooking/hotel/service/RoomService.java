package com.hotelbooking.hotel.service;

import com.hotelbooking.hotel.entity.Hotel;
import com.hotelbooking.hotel.entity.Room;
import com.hotelbooking.hotel.repository.HotelRepository;
import com.hotelbooking.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    // CREATE
    public Room createRoom(Room room) {

        // only check hotel exists
        hotelRepository.findById(room.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        room.setAvailable(true);
        return roomRepository.save(room);
    }

    // UPDATE
    public Room updateRoom(UUID id, Room updated) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomNumber(updated.getRoomNumber());
        room.setType(updated.getType());
        room.setPrice(updated.getPrice());
        room.setCapacity(updated.getCapacity());
        room.setAvailable(updated.getAvailable());

        return roomRepository.save(room);
    }

    // DELETE
    public void deleteRoom(UUID id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        roomRepository.delete(room);
    }

    // GET BY HOTEL
    public List<Room> getRoomsByHotel(UUID hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    // GET ONE
    public Room getRoom(UUID id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }
}
