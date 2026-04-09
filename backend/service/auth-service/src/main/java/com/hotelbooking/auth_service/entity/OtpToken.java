package com.hotelbooking.auth_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;



import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String email;

    private String otpHash;

    @Enumerated(EnumType.STRING)
    private OtpPurpose purpose;

    private LocalDateTime expiresAt;

    private boolean used;

    private LocalDateTime createdAt;
}
