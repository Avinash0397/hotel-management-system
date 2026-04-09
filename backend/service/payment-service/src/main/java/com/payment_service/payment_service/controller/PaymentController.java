package com.payment_service.payment_service.controller;

import com.payment_service.payment_service.dto.PaymentRequest;
import com.payment_service.payment_service.entity.Payment;
import com.payment_service.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public Payment createPayment(@RequestBody PaymentRequest request) {
        return paymentService.createPayment(request.getBookingId(), request.getAmount());
    }

    @PostMapping("/{paymentId}/process")
    public Payment processPayment(@PathVariable UUID paymentId) {
        return paymentService.processPayment(paymentId);
    }

    @PostMapping("/{paymentId}/fail")
    public Payment failPayment(@PathVariable UUID paymentId) {
        return paymentService.failPayment(paymentId);
    }

    @GetMapping("/all")
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/booking/{bookingId}")
    public List<Payment> getByBooking(@PathVariable UUID bookingId) {
        return paymentService.getPaymentsByBooking(bookingId);
    }
}
