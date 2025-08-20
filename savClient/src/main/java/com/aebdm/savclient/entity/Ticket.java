package com.aebdm.savclient.entity;

import com.aebdm.savclient.enums.StatutTicket;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private String typeProbleme; // Ajout du champ de votre cahier des charges

    @Enumerated(EnumType.STRING)
    private StatutTicket statut;

    private LocalDateTime dateCreation;
    private String nomFichier; // Pour la pièce jointe

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false) // client_id dans votre cahier des charges
    private User client;

    @ManyToOne
    @JoinColumn(name = "technicien_id") // technicien_id dans votre cahier des charges
    private User technicien;

    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL)
    private List<Comment> comments;
}
