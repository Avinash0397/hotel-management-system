package com.hotelbooking.auth_service.repository;

import com.hotelbooking.auth_service.entity.OtpPurpose;
import com.hotelbooking.auth_service.entity.OtpToken;
import com.hotelbooking.auth_service.entity.User;
import org.hibernate.validator.constraints.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

}
