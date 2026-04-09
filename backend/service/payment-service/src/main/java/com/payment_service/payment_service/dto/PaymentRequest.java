package com.payment_service.payment_service.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PaymentRequest {
    private UUID bookingId;
    private Double amount;
}
