package com.aebdm.savclient.service;

import com.aebdm.savclient.dto.DashboardStatsDto;
import com.aebdm.savclient.enums.StatutTicket;
import com.aebdm.savclient.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TicketRepository ticketRepository;

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalTicketsOuverts(ticketRepository.countByStatut(StatutTicket.OUVERT));
        stats.setTotalTicketsEnCours(ticketRepository.countByStatut(StatutTicket.EN_COURS));
        stats.setTotalTicketsClotures(ticketRepository.countByStatut(StatutTicket.CLOTURE));

        stats.setTicketsParType(
                ticketRepository.countTicketsParType().stream()
                        .collect(Collectors.toMap(obj -> (String) obj[0], obj -> (Long) obj[1]))
        );

        stats.setTicketsResolusParTechnicien(
                ticketRepository.countTicketsResolusParTechnicien().stream()
                        .collect(Collectors.toMap(obj -> (String) obj[0], obj -> (Long) obj[1]))
        );

        return stats;
    }
}