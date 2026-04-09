package com.booking.booking_service.service;

import com.booking.booking_service.entity.Booking;
import com.booking.booking_service.entity.BookingStatus;
import com.booking.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Booking createBooking(Booking booking, String userEmail) {

        booking.setUserEmail(userEmail);
        booking.setStatus(BookingStatus.CREATED);

        // totalPrice is already calculated on the frontend (price * nights)
        // Just save it as-is

        return bookingRepository.save(booking);
    }
    public List<Booking> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }


    public Booking cancelBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(
                java.util.UUID.fromString(bookingId)
        ).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("You cannot cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBookingByManager(String bookingId) {
        Booking booking = bookingRepository.findById(
                java.util.UUID.fromString(bookingId)
        ).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(booking);
    }
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking confirmBooking(String bookingId) {
        Booking booking = bookingRepository.findById(
                java.util.UUID.fromString(bookingId)
        ).orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

}