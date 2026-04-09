package com.hotelbooking.auth_service.service;

import com.hotelbooking.auth_service.dto.*;
import org.jspecify.annotations.Nullable;

public interface AuthService {
    void register(RegisterRequest request);
    void verifyOtp(VerifyOtpRequest request);
    String login(LoginRequest request);
    void resendOtp(String email);
    void forgotPassword(ForgotPasswordRequest req);
    void resetPassword(ResetPasswordRequest req);

}
