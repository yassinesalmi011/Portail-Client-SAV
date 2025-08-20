package com.aebdm.savclient.controller;

import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.enums.Role;
import com.aebdm.savclient.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // DTO simple pour ne pas exposer le mot de passe
    public record UserDto(Long id, String nom) {}

    @GetMapping("/technicians")
    public ResponseEntity<List<UserDto>> getTechnicians() {
        List<User> technicians = userRepository.findByRole(Role.TECHNICIEN);
        List<UserDto> dtos = technicians.stream()
                .map(user -> new UserDto(user.getId(), user.getNom()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
