package com.hotelbooking.auth_service.controller;

import com.hotelbooking.auth_service.dto.ProfileResponse;
import com.hotelbooking.auth_service.dto.UpdateProfileRequest;
import com.hotelbooking.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1️⃣ Get Profile
    @GetMapping("/me")
    public ProfileResponse getProfile(Authentication authentication) {
        return userService.getProfile(authentication.getName());
    }

    // 2️⃣ Update Profile
    @PutMapping("/me")
    public ProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody @Valid UpdateProfileRequest request
    ) {
        return userService.updateProfile(authentication.getName(), request);
    }

    // 3️⃣ Delete Account
    @DeleteMapping("/me")
    public String deleteAccount(Authentication authentication) {
        userService.deleteAccount(authentication.getName());
        return "Account deleted successfully";
    }
}
