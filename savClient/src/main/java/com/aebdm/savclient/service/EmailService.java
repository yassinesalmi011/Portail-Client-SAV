package com.aebdm.savclient.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@aebdm-sav.com"); // Vous pouvez mettre ce que vous voulez
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            // En cas d'erreur, on l'affiche dans la console sans faire planter l'application
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }
}