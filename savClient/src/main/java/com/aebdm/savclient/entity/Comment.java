package com.aebdm.savclient.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String message; // "message" dans votre cahier des charges

    private LocalDateTime date; // "date" dans votre cahier des charges

    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false) // "auteur_id"
    private User auteur;

    @ManyToOne
    @JoinColumn(name = "ticket_id", nullable = false) // "ticket_id"
    private Ticket ticket;
}
