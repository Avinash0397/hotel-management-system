package com.hotelbooking.auth_service.dto;

import com.hotelbooking.auth_service.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String number;
    private String password;
    private Role role;
}
