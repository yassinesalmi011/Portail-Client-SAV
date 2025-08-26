package com.aebdm.savclient.service;

import com.aebdm.savclient.dto.*;
import com.aebdm.savclient.entity.Comment;
import com.aebdm.savclient.entity.Ticket;
import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.enums.Role;
import com.aebdm.savclient.enums.StatutTicket   ;
import com.aebdm.savclient.repository.CommentRepository;
import com.aebdm.savclient.repository.TicketRepository;
import com.aebdm.savclient.repository.UserRepository; // <-- Assurez-vous que l'import est là
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository; // <-- INJECTION AJOUTÉE
    private final CommentRepository commentRepository; // <-- LIGNE À AJOUTER

    // ==========================================================
    // ===            MÉTHODE createTicket CORRIGÉE           ===
    // ==========================================================
    public TicketDto createTicket(CreateTicketRequest request) {
        // 1. Récupérer le nom de l'utilisateur connecté (son email)
        String userEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        // 2. Aller chercher l'entité User complète depuis la base de données
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3. Créer le ticket
        Ticket ticket = new Ticket();
        ticket.setTitre(request.getTitre());
        ticket.setDescription(request.getDescription());
        ticket.setTypeProbleme(request.getTypeProbleme());
        ticket.setStatut(StatutTicket.OUVERT);
        ticket.setDateCreation(LocalDateTime.now());
        ticket.setClient(currentUser);

        Ticket savedTicket = ticketRepository.save(ticket);
        return convertToDto(savedTicket);
    }

    // ==========================================================
    // ===           MÉTHODE getAllTickets CORRIGÉE           ===
    // ==========================================================
    // Dans TicketService.java
    public List<TicketDto> getAllTickets() {
        String userEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Ticket> tickets;

        // --- MODIFICATION DE LA LOGIQUE ICI ---
        if (currentUser.getRole() == Role.ADMIN) {
            // L'ADMIN voit tout
            tickets = ticketRepository.findAll();
        } else if (currentUser.getRole() == Role.TECHNICIEN) {
            // Le TECHNICIEN ne voit que les tickets qui lui sont assignés
            tickets = ticketRepository.findByTechnicienId(currentUser.getId());
        } else { // C'est un CLIENT
            // Le CLIENT ne voit que ses propres tickets
            tickets = ticketRepository.findByClientId(currentUser.getId());
        }

        return tickets.stream()
                .map(this::convertToDto) // Assurez-vous d'utiliser le bon convertisseur
                .collect(Collectors.toList());
    }
    // NOUVELLE MÉTHODE pour récupérer un ticket par son ID
    public TicketDto getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID : " + ticketId));

        // TODO: Ajouter une vérification de sécurité ici plus tard
        // (ex: un client ne peut voir que ses propres tickets)

        return convertToDto(ticket);
    }

    // NOUVELLE MÉTHODE de conversion qui inclut les commentaires
    private TicketDto convertToDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        // ... (copiez toutes les lignes de l'ancien convertToDto)
        dto.setId(ticket.getId());
        dto.setTitre(ticket.getTitre());
        dto.setDescription(ticket.getDescription());
        dto.setTypeProbleme(ticket.getTypeProbleme());
        dto.setStatut(ticket.getStatut());
        dto.setDateCreation(ticket.getDateCreation());
        dto.setNomClient(ticket.getClient().getNom());
        if (ticket.getTechnicien() != null) {
            dto.setNomTechnicien(ticket.getTechnicien().getNom());
        }

        // Conversion des commentaires
        if (ticket.getComments() != null) {
            dto.setComments(ticket.getComments().stream().map(comment -> {
                CommentDto commentDto = new CommentDto();
                commentDto.setId(comment.getId());
                commentDto.setContenu(comment.getMessage());
                commentDto.setDateCreation(comment.getDate());
                commentDto.setNomAuteur(comment.getAuteur().getNom());
                return commentDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
    // ... dans TicketService.java

    public CommentDto addCommentToTicket(Long ticketId, AddCommentRequest request) {
        // 1. Récupérer l'utilisateur connecté
        String userEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 2. Récupérer le ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        // TODO: Ajouter une vérification pour s'assurer que l'utilisateur a le droit de commenter

        // 3. Créer le nouveau commentaire
        Comment comment = new Comment();
        comment.setMessage(request.getContenu());
        comment.setDate(LocalDateTime.now());
        comment.setAuteur(currentUser);
        comment.setTicket(ticket);

        // 4. Sauvegarder le commentaire
        Comment savedComment = commentRepository.save(comment);

        // 5. Convertir le commentaire sauvegardé en DTO pour le renvoyer
        CommentDto commentDto = new CommentDto();
        commentDto.setId(savedComment.getId());
        commentDto.setContenu(savedComment.getMessage());
        commentDto.setDateCreation(savedComment.getDate());
        commentDto.setNomAuteur(savedComment.getAuteur().getNom());

        return commentDto;
    }
    public TicketDto updateTicketStatus(Long ticketId, UpdateStatusRequest request) {
        // 1. Récupérer le ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        // 2. Récupérer l'utilisateur connecté
        String userEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3. Vérification de sécurité : Seul un ADMIN ou le TECHNICIEN assigné peut changer le statut
        if (currentUser.getRole() != Role.ADMIN &&
                (ticket.getTechnicien() == null || !ticket.getTechnicien().getId().equals(currentUser.getId()))) {
            throw new IllegalStateException("Vous n'avez pas la permission de modifier ce ticket.");
        }

        // 4. Mettre à jour le statut et sauvegarder
        ticket.setStatut(request.getStatut());
        Ticket updatedTicket = ticketRepository.save(ticket);

        // 5. Renvoyer le ticket mis à jour
        return convertToDto(updatedTicket); // On utilise notre convertisseur existant
    }
    public TicketDto assignTicket(Long ticketId, AssignTicketRequest request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        User technicien = userRepository.findById(request.getTechnicienId())
                .orElseThrow(() -> new RuntimeException("Technicien non trouvé"));

        if (technicien.getRole() != Role.TECHNICIEN) {
            throw new IllegalArgumentException("L'utilisateur sélectionné n'est pas un technicien.");
        }

        ticket.setTechnicien(technicien);
        // On peut aussi changer le statut automatiquement à "Assigné" si on veut
        // ticket.setStatut(StatutTicket.ASSIGNE);

        Ticket updatedTicket = ticketRepository.save(ticket);
        return convertToDto(updatedTicket);
    }
    public void deleteTicket(Long ticketId) {
        // On vérifie que le ticket existe avant de le supprimer pour éviter une erreur
        if (!ticketRepository.existsById(ticketId)) {
            throw new RuntimeException("Ticket non trouvé avec l'ID: " + ticketId);
        }
        ticketRepository.deleteById(ticketId);
    }
}