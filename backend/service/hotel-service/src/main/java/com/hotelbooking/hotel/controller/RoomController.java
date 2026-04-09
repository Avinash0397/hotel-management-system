package com.hotelbooking.hotel.controller;

import com.hotelbooking.hotel.entity.Room;
import com.hotelbooking.hotel.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public Room createRoom(@RequestBody Room room) {
        return roomService.createRoom(room);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public Room updateRoom(@PathVariable UUID id, @RequestBody Room room) {
        return roomService.updateRoom(id, room);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public String deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return "Room deleted successfully";
    }

    @GetMapping("/hotel/{hotelId}")
    public List<Room> getRoomsByHotel(@PathVariable UUID hotelId) {
        return roomService.getRoomsByHotel(hotelId);
    }

    @GetMapping("/{id}")
    public Room getRoom(@PathVariable UUID id) {
        return roomService.getRoom(id);
    }
}
