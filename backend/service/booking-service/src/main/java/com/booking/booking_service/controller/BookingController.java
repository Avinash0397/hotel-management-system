package com.booking.booking_service.controller;

import com.booking.booking_service.entity.Booking;
import com.booking.booking_service.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public Booking createBooking(
            @RequestBody Booking booking,
            Authentication auth
    ) {
        return bookingService.createBooking(booking, auth.getName());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public Booking cancelBooking(
            @PathVariable String id,
            Authentication auth
    ) {
        return bookingService.cancelBooking(id, auth.getName());
    }

    @DeleteMapping("/{id}/force")
    @PreAuthorize("hasRole('MANAGER')")
    public Booking cancelBookingByManager(@PathVariable String id) {
        return bookingService.cancelBookingByManager(id);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Booking> getMyBookings(Authentication auth) {
        return bookingService.getMyBookings(auth.getName());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Booking> getAllBookingsForManager() {
        return bookingService.getAllBookings();
    }

    // Called internally by payment-service after successful payment
    @PutMapping("/{id}/confirm")
    public Booking confirmBooking(@PathVariable String id) {
        return bookingService.confirmBooking(id);
    }

}
