package com.hotelbooking.auth_service.service.impl;

import com.hotelbooking.auth_service.config.OtpGenerator;
import com.hotelbooking.auth_service.dto.*;
import com.hotelbooking.auth_service.entity.OtpPurpose;
import com.hotelbooking.auth_service.entity.OtpToken;
import com.hotelbooking.auth_service.entity.User;
import com.hotelbooking.auth_service.repository.OtpTokenRepository;
import com.hotelbooking.auth_service.repository.UserRepository;
import com.hotelbooking.auth_service.service.AuthService;
import com.hotelbooking.auth_service.service.EmailService;
import com.hotelbooking.auth_service.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {


    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final OtpTokenRepository otpRepo;
    private final PasswordEncoder passwordEncoder;
    private final OtpGenerator otpGenerator;
    private final EmailService emailService;

    @Override
    public void register(RegisterRequest req) {

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .number(req.getNumber())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole())
                .enabled(false)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String otp = otpGenerator.generateOtp();
        String hash = passwordEncoder.encode(otp);

        OtpToken token = OtpToken.builder()
                .email(req.getEmail())
                .otpHash(hash)
                .purpose(OtpPurpose.REGISTER)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();

        otpRepo.save(token);

        // Send OTP via email (will be logged to console if SMTP fails)
        try {
            emailService.sendOtp(req.getEmail(), otp);
        } catch (Exception e) {
            System.out.println("\n==================================");
            System.out.println("EMAIL SEND FAILED - OTP FOR DEVELOPMENT:");
            System.out.println("Email: " + req.getEmail());
            System.out.println("OTP: " + otp);
            System.out.println("==================================\n");
        }
    }


    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Email not verified");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(user);
    }



    @Override
    public void verifyOtp(VerifyOtpRequest req) {

        OtpToken token = otpRepo
                .findByEmailAndPurposeAndUsedFalse(req.getEmail(), OtpPurpose.REGISTER)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!passwordEncoder.matches(req.getOtp(), token.getOtpHash())) {
            throw new RuntimeException("Invalid OTP");
        }

        token.setUsed(true);
        otpRepo.save(token);

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    @Override
    public void resendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            throw new RuntimeException("Account already verified");
        }

        // invalidate old OTPs
        otpRepo.findByEmailAndPurposeAndUsedFalse(email, OtpPurpose.REGISTER)
                .ifPresent(token -> {
                    token.setUsed(true);
                    otpRepo.save(token);
                });

        String otp = otpGenerator.generateOtp();
        String hash = passwordEncoder.encode(otp);

        OtpToken newToken = OtpToken.builder()
                .email(email)
                .otpHash(hash)
                .purpose(OtpPurpose.REGISTER)
                .expiresAt(LocalDateTime.now().plusSeconds(300))
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();

        otpRepo.save(newToken);

        // Send OTP via email (will be logged to console if SMTP fails)
        try {
            emailService.sendOtp(email, otp);
        } catch (Exception e) {
            System.out.println("\n==================================");
            System.out.println("EMAIL SEND FAILED - OTP FOR DEVELOPMENT:");
            System.out.println("Email: " + email);
            System.out.println("OTP: " + otp);
            System.out.println("==================================\n");
        }
    }
    @Override
    public void forgotPassword(ForgotPasswordRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // invalidate old otp
        otpRepo.findByEmailAndPurposeAndUsedFalse(req.getEmail(), OtpPurpose.FORGOT_PASSWORD)
                .ifPresent(token -> {
                    token.setUsed(true);
                    otpRepo.save(token);
                });

        String otp = otpGenerator.generateOtp();
        String hash = passwordEncoder.encode(otp);

        OtpToken token = OtpToken.builder()
                .email(req.getEmail())
                .otpHash(hash)
                .purpose(OtpPurpose.FORGOT_PASSWORD)
                .expiresAt(LocalDateTime.now().plusSeconds(300))
                .used(false)
                .createdAt(LocalDateTime.now())
                .build();

        otpRepo.save(token);
        emailService.sendOtp(req.getEmail(), otp);
    }

    @Override
    public void resetPassword(ResetPasswordRequest req) {

        OtpToken token = otpRepo
                .findByEmailAndPurposeAndUsedFalse(req.getEmail(), OtpPurpose.FORGOT_PASSWORD)
                .orElseThrow(() -> new RuntimeException("OTP not found or expired"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!passwordEncoder.matches(req.getOtp(), token.getOtpHash())) {
            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        token.setUsed(true);
        otpRepo.save(token);
    }



}
