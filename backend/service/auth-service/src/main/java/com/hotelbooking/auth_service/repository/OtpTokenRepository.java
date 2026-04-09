package com.hotelbooking.auth_service.repository;

import com.hotelbooking.auth_service.entity.OtpPurpose;
import com.hotelbooking.auth_service.entity.OtpToken;
import org.hibernate.validator.constraints.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, UUID> {
    Optional<OtpToken> findByEmailAndPurposeAndUsedFalse(String email, OtpPurpose purpose);
}
