package com.hotelbooking.auth_service.service;

import com.hotelbooking.auth_service.dto.ProfileResponse;
import com.hotelbooking.auth_service.dto.UpdateProfileRequest;

public interface UserService {

    ProfileResponse getProfile(String email);

    ProfileResponse updateProfile(String email, UpdateProfileRequest request);

    void deleteAccount(String email);
}
