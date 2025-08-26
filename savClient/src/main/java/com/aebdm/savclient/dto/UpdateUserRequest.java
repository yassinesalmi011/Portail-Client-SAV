package com.aebdm.savclient.dto;

import com.aebdm.savclient.enums.Role;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String nom;
    private String telephone;
    private String fonction;
    private String entreprise;
    private String email;
    private Role role;
    // Le mot de passe est optionnel. S'il est vide, on ne le change pas.
    private String password;
}