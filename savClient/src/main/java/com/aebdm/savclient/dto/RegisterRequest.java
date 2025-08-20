package com.aebdm.savclient.dto;

import com.aebdm.savclient.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String email;
    private String password;
    private Role role;
}