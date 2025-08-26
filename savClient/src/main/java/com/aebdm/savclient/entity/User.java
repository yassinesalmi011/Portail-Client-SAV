package com.aebdm.savclient.entity;

import com.aebdm.savclient.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "users")
// ==========================================================
// ===         MODIFICATION PRINCIPALE ICI                ===
// ==========================================================
public class User implements UserDetails { // On implémente l'interface UserDetails

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String telephone;    // <-- AJOUT
    private String fonction;     // <-- AJOUT
    private String entreprise;   // <-- AJOUT
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;


    // ==========================================================
    // ===   MÉTHODES REQUISES PAR L'INTERFACE UserDetails    ===
    // ==========================================================

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // On s'assure que l'autorité commence bien par "ROLE_"
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    @Override
    public String getPassword() {
        // Spring Security utilisera cette méthode pour obtenir le mot de passe
        return password;
    }

    @Override
    public String getUsername() {
        // On utilise l'email comme "username" pour l'authentification
        return email;
    }

    // Pour notre projet simple, on considère que les comptes sont toujours valides.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }



    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}