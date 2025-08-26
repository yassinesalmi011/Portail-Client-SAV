package com.aebdm.savclient.dto;

import com.aebdm.savclient.enums.Role;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String nom;
    private String email;
    private Role role;
    private String telephone;
    private String fonction;
    private String entreprise;
}