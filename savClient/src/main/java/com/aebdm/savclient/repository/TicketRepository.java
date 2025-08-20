package com.aebdm.savclient.repository;

import com.aebdm.savclient.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByClientId(Long clientId);
}