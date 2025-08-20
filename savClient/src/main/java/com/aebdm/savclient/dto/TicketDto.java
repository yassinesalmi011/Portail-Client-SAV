package com.aebdm.savclient.dto;


import com.aebdm.savclient.enums.StatutTicket;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List; // Assurez-vous d'avoir cet import

@Data
public class TicketDto {
    private Long id;
    private String titre;
    private String description;
    private String typeProbleme;
    private StatutTicket statut;
    private LocalDateTime dateCreation;
    private String nomClient; // On va afficher le nom, pas l'ID
    private String nomTechnicien; // Peut être null
    private List<CommentDto> comments; // <-- AJOUTEZ CETTE LIGNE

}
