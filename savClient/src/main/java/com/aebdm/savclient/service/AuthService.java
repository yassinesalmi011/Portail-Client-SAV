package com.aebdm.savclient.service;

import com.aebdm.savclient.dto.AuthRequest;
import com.aebdm.savclient.dto.AuthResponse;
import com.aebdm.savclient.dto.RegisterRequest;
import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.repository.UserRepository;
import com.aebdm.savclient.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// -- NOUVEAUX IMPORTS NÉCESSAIRES --
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    // La méthode register peut aussi être améliorée pour inclure le rôle
    public AuthResponse register(RegisterRequest request) {
        var user = new User();
        user.setNom(request.getNom());
        user.setTelephone(request.getTelephone());
        user.setFonction(request.getFonction());
        user.setEntreprise(request.getEntreprise());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        // -- AMÉLIORATION OPTIONNELLE : On ajoute aussi le rôle au token lors de l'inscription --
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        var jwtToken = jwtUtil.generateToken(claims, user); // Utiliser la surcharge
        return AuthResponse.builder().token(jwtToken).build();
    }

    // ==========================================================
    // ===          MÉTHODE `login` MODIFIÉE ICI              ===
    // ==========================================================
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        // 1. Créer une "Map" pour stocker les informations supplémentaires (claims)
        Map<String, Object> claims = new HashMap<>();

        // 2. Ajouter le rôle de l'utilisateur à la Map.
        //    .name() convertit l'énumération (ex: Role.ADMIN) en chaîne de caractères ("ADMIN")
        claims.put("role", user.getRole().name());

        // 3. Appeler la méthode generateToken qui accepte les claims supplémentaires
        var jwtToken = jwtUtil.generateToken(claims, user);

        // 4. Construire et retourner la réponse
        return AuthResponse.builder().token(jwtToken).build();
    }
}