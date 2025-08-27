package com.aebdm.savclient.repository;

import com.aebdm.savclient.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import com.aebdm.savclient.enums.StatutTicket; // Nouvel import
import org.springframework.data.jpa.repository.Query;   // Nouvel import
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByClientId(Long clientId);
    // Dans TicketRepository.java
    List<Ticket> findByTechnicienId(Long technicienId);
    // Compter les tickets par statut
    long countByStatut(StatutTicket statut);

    // Compter les tickets par type de problème
    @Query("SELECT t.typeProbleme, COUNT(t) FROM Ticket t GROUP BY t.typeProbleme")
    List<Object[]> countTicketsParType();

    // Compter les tickets résolus par chaque technicien
    @Query("SELECT t.technicien.nom, COUNT(t) FROM Ticket t WHERE t.statut = 'CLOTURE' AND t.technicien IS NOT NULL GROUP BY t.technicien.nom")
    List<Object[]> countTicketsResolusParTechnicien();
}