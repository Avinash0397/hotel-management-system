package com.hotelbooking.auth_service.dto;

import com.hotelbooking.auth_service.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ProfileResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String number;
    private Role role;
}
