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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        var user = new User();
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hachage du mot de passe
        user.setRole(request.getRole());

        userRepository.save(user);

        var jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // Si on arrive ici, l'utilisateur est bien authentifié
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(); // Devrait toujours exister si l'authentification a réussi

        var jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}