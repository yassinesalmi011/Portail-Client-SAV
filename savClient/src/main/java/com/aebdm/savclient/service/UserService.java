package com.aebdm.savclient.service;

import com.aebdm.savclient.controller.UserController;
import com.aebdm.savclient.dto.UpdateUserRequest;
import com.aebdm.savclient.dto.UserDto;
import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));

        // Mettre à jour les champs
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setTelephone(request.getTelephone());
        user.setFonction(request.getFonction());
        user.setEntreprise(request.getEntreprise());
        user.setRole(request.getRole());

        // Mettre à jour le mot de passe SEULEMENT s'il est fourni
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        // Renvoyer le DTO de l'utilisateur mis à jour
        UserDto dto = new UserDto(); // On utilise le constructeur vide

// On remplit l'objet avec les setters
        dto.setId(updatedUser.getId());
        dto.setNom(updatedUser.getNom());
        dto.setEmail(updatedUser.getEmail());
        dto.setRole(updatedUser.getRole());
        dto.setTelephone(updatedUser.getTelephone());
        dto.setFonction(updatedUser.getFonction());
        dto.setEntreprise(updatedUser.getEntreprise());

        return dto; // On renvoie l'objet rempli
    }
}