package com.booking.booking_service.controller;

import com.booking.booking_service.entity.Booking;
import com.booking.booking_service.entity.BookingStatus;
import com.booking.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final BookingRepository bookingRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('MANAGER')")
    public Map<String, Object> getSummary() {
        List<Booking> all = bookingRepository.findAll();
        double totalRevenue = all.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .mapToDouble(Booking::getTotalPrice).sum();

        long confirmed = all.stream().filter(b -> b.getStatus() == BookingStatus.CONFIRMED).count();
        long cancelled = all.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();
        long pending = all.stream().filter(b -> b.getStatus() == BookingStatus.CREATED).count();

        return Map.of(
            "totalBookings", all.size(),
            "totalRevenue", totalRevenue,
            "confirmed", confirmed,
            "cancelled", cancelled,
            "pending", pending
        );
    }

    @GetMapping("/monthly")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Map<String, Object>> getMonthlyRevenue() {
        List<Booking> all = bookingRepository.findAll();
        Map<String, Double> monthly = new LinkedHashMap<>();

        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        for (String m : months) monthly.put(m, 0.0);

        all.stream()
            .filter(b -> b.getStatus() == BookingStatus.CONFIRMED && b.getCheckIn() != null)
            .forEach(b -> {
                String month = months[b.getCheckIn().getMonthValue() - 1];
                monthly.merge(month, b.getTotalPrice(), Double::sum);
            });

        return monthly.entrySet().stream()
                .map(e -> Map.<String, Object>of("month", e.getKey(), "revenue", e.getValue()))
                .collect(Collectors.toList());
    }

    @GetMapping("/top-hotels")
    @PreAuthorize("hasRole('MANAGER')")
    public List<Map<String, Object>> getTopHotels() {
        List<Booking> all = bookingRepository.findAll();
        return all.stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.groupingBy(
                    b -> b.getHotelId().toString(),
                    Collectors.summingDouble(Booking::getTotalPrice)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(e -> Map.<String, Object>of("hotelId", e.getKey(), "revenue", e.getValue()))
                .collect(Collectors.toList());
    }
}
