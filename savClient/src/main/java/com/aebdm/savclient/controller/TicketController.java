package com.aebdm.savclient.controller;

import com.aebdm.savclient.dto.CreateTicketRequest;
import com.aebdm.savclient.dto.TicketDto;
import com.aebdm.savclient.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aebdm.savclient.dto.AddCommentRequest; // <-- Ne pas oublier l'import
import com.aebdm.savclient.dto.CommentDto;
import java.util.List;
import com.aebdm.savclient.dto.UpdateStatusRequest; // <-- Ne pas oublier l'import
import com.aebdm.savclient.dto.AssignTicketRequest; // <-- Import

@RestController
@RequestMapping("/api/tickets") // Toutes les routes ici commenceront par /api/tickets
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Endpoint pour créer un nouveau ticket
    // Seuls les utilisateurs authentifiés pourront y accéder grâce à notre configuration de sécurité
    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody CreateTicketRequest request) {
        TicketDto createdTicket = ticketService.createTicket(request);
        return ResponseEntity.ok(createdTicket);
    }

    // Endpoint pour récupérer les tickets
    // La logique dans le service décidera quoi renvoyer en fonction du rôle
    @GetMapping
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        List<TicketDto> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(tickets);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id) {
        TicketDto ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }
    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable Long ticketId,
            @RequestBody AddCommentRequest request
    ) {
        CommentDto newComment = ticketService.addCommentToTicket(ticketId, request);
        return ResponseEntity.ok(newComment);
    }
    @PutMapping("/{ticketId}/status")
    public ResponseEntity<TicketDto> updateStatus(
            @PathVariable Long ticketId,
            @RequestBody UpdateStatusRequest request
    ) {
        TicketDto updatedTicket = ticketService.updateTicketStatus(ticketId, request);
        return ResponseEntity.ok(updatedTicket);
    }
    @PutMapping("/{ticketId}/assign")
    public ResponseEntity<TicketDto> assignTicket(
            @PathVariable Long ticketId,
            @RequestBody AssignTicketRequest request
    ) {
        // TODO: Sécuriser cette route pour que seul l'ADMIN puisse l'appeler
        TicketDto updatedTicket = ticketService.assignTicket(ticketId, request);
        return ResponseEntity.ok(updatedTicket);
    }
}
