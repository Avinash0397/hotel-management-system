package com.payment_service.payment_service.service;

import com.payment_service.payment_service.entity.Payment;
import com.payment_service.payment_service.entity.PaymentStatus;
import com.payment_service.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;

    @Value("${booking.service.url}")
    private String bookingServiceUrl;

    public Payment createPayment(UUID bookingId, Double amount) {
        Payment payment = Payment.builder()
                .bookingId(bookingId)
                .amount(amount)
                .status(PaymentStatus.CREATED)
                .build();
        return paymentRepository.save(payment);
    }

    public Payment processPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setTransactionId("TXN-" + UUID.randomUUID().toString().toUpperCase());
        payment.setStatus(PaymentStatus.SUCCESS);
        Payment saved = paymentRepository.save(payment);

        // Notify booking-service to confirm the booking
        try {
            restTemplate.put(
                bookingServiceUrl + "/api/bookings/" + saved.getBookingId() + "/confirm",
                null
            );
        } catch (Exception e) {
            log.error("Failed to confirm booking {}: {}", saved.getBookingId(), e.getMessage());
        }

        return saved;
    }

    public Payment failPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getPaymentsByBooking(UUID bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }
}
