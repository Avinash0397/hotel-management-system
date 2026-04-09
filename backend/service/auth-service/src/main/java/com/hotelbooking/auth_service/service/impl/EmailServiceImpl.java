package com.hotelbooking.auth_service.service.impl;

import com.hotelbooking.auth_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(String email, String otp) {

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("StayEase | Email Verification OTP");

        msg.setText("""
                Hello,

                Thank you for using StayEase Hotel Booking Platform.

                Your One-Time Password (OTP) is:

                🔐  %s

                This OTP is valid for 5 minutes.
                Please do not share this OTP with anyone.

                If you did not request this, please ignore this email.

                Regards,
                StayEase Team
                support@stayease.com
                """.formatted(otp));

        mailSender.send(msg);
    }
}
