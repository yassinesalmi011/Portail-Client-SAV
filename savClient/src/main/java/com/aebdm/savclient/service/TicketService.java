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
import org.springframework.web.multipart.MultipartFile; // Nouvel import

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository; // <-- INJECTION AJOUTÉE
    private final CommentRepository commentRepository; // <-- LIGNE À AJOUTER
    private final FileStorageService fileStorageService; // <-- INJECTION
    private final EmailService emailService;
    // ==========================================================
    // ===            MÉTHODE createTicket CORRIGÉE           ===
    // ==========================================================
    public TicketDto createTicket(CreateTicketRequest request, MultipartFile fichier) {
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
        // --- AJOUT DE LA LOGIQUE FICHIER ---
        if (fichier != null && !fichier.isEmpty()) {
            String fileName = fileStorageService.storeFile(fichier);
            ticket.setNomFichier(fileName);
        }
        // --- FIN DE LA LOGIQUE FICHIER ---
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
        dto.setNomFichier(ticket.getNomFichier()); // <-- AJOUTER

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

        // ==========================================================
        // ===         LOGIQUE DE NOTIFICATION AJOUTÉE ICI        ===
        // ==========================================================
        String subject = "Nouveau commentaire sur votre ticket #" + ticket.getId() + " : " + ticket.getTitre();
        String textTemplate = "Bonjour %s,\n\n" +
                "Un nouveau commentaire a été ajouté au ticket '" + ticket.getTitre() + "' par " + currentUser.getNom() + ".\n\n" +
                "Contenu du message :\n\"" + savedComment.getMessage() + "\"\n\n" +
                "Vous pouvez répondre en vous connectant au portail SAV.\n\n" +
                "Cordialement,\nL'équipe de support AEBDM.";

        // Qui notifier ?
        // Si l'auteur du commentaire est le client, on notifie le technicien assigné (s'il y en a un).
        if (currentUser.getRole() == Role.CLIENT && ticket.getTechnicien() != null) {
            String textPourTechnicien = String.format(textTemplate, ticket.getTechnicien().getNom());
            emailService.sendSimpleMessage(ticket.getTechnicien().getEmail(), subject, textPourTechnicien);
        }
        // Si l'auteur est un technicien ou un admin, on notifie le client.
        else if (currentUser.getRole() == Role.TECHNICIEN || currentUser.getRole() == Role.ADMIN) {
            String textPourClient = String.format(textTemplate, ticket.getClient().getNom());
            emailService.sendSimpleMessage(ticket.getClient().getEmail(), subject, textPourClient);
        }
        // Note : On pourrait aussi notifier l'admin dans tous les cas si nécessaire.
        // --- FIN DE LA LOGIQUE DE NOTIFICATION ---


        // 5. Convertir le commentaire sauvegardé en DTO pour le renvoyer
        CommentDto commentDto = new CommentDto();
        commentDto.setId(savedComment.getId());
        commentDto.setContenu(savedComment.getMessage());
        commentDto.setDateCreation(savedComment.getDate());
        commentDto.setNomAuteur(savedComment.getAuteur().getNom());

        return commentDto;
    }
    // Dans TicketService.java

    public TicketDto updateTicketStatus(Long ticketId, UpdateStatusRequest request) { // <-- Le nom a été corrigé ici
        // 1. Récupérer le ticket
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));

        // 2. Récupérer l'utilisateur connecté
        String userEmail = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // 3. Vérification de sécurité
        if (currentUser.getRole() != Role.ADMIN &&
                (ticket.getTechnicien() == null || !ticket.getTechnicien().getId().equals(currentUser.getId()))) {
            throw new IllegalStateException("Vous n'avez pas la permission de modifier ce ticket.");
        }

        StatutTicket ancienStatut = ticket.getStatut();

        // 4. Mettre à jour le statut et sauvegarder
        ticket.setStatut(request.getStatut()); // Cette ligne est maintenant correcte
        Ticket updatedTicket = ticketRepository.save(ticket);

        // 5. Logique de notification
        if (ancienStatut != updatedTicket.getStatut()) {
            String subject = "Mise à jour de votre ticket #" + updatedTicket.getId() + " : " + updatedTicket.getTitre();
            String textPourClient = "Bonjour " + updatedTicket.getClient().getNom() + ",\n\n" +
                    "Le statut de votre ticket a été mis à jour par " + currentUser.getNom() + ".\n" +
                    "Nouveau statut : " + updatedTicket.getStatut() + ".\n\n" +
                    "Cordialement,\nL'équipe de support AEBDM.";
            emailService.sendSimpleMessage(updatedTicket.getClient().getEmail(), subject, textPourClient);

            if (updatedTicket.getTechnicien() != null) {
                String textPourTechnicien = "Bonjour " + updatedTicket.getTechnicien().getNom() + ",\n\n" +
                        "Le statut du ticket #" + updatedTicket.getId() + " a été mis à jour par " + currentUser.getNom() + ".\n" +
                        "Nouveau statut : " + updatedTicket.getStatut() + ".\n\n" +
                        "Cordialement,\nLe système de portail SAV.";
                emailService.sendSimpleMessage(updatedTicket.getTechnicien().getEmail(), subject, textPourTechnicien);
            }
        }

        // 6. Renvoyer le ticket mis à jour
        return convertToDto(updatedTicket);
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