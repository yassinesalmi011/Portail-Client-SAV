package com.aebdm.savclient.controller;

import com.aebdm.savclient.dto.UpdateUserRequest;
import com.aebdm.savclient.dto.UserDto; // <-- Nouvel import
import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.enums.Role;
import com.aebdm.savclient.repository.UserRepository;
import com.aebdm.savclient.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    // Fonction privée pour convertir une Entité en DTO
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setTelephone(user.getTelephone());
        dto.setFonction(user.getFonction());
        dto.setEntreprise(user.getEntreprise());
        return dto;
    }

    @GetMapping("/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getTechnicians() {
        return ResponseEntity.ok(
                userRepository.findByRole(Role.TECHNICIEN).stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(
                userRepository.findAll().stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        // Ajouter une sécurité pour ne pas pouvoir se supprimer soi-même
        // (à faire dans le service)
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Réponse 204 No Content
    }
}