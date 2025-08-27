package com.aebdm.savclient.dto;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardStatsDto {
    private long totalTicketsOuverts;
    private long totalTicketsEnCours;
    private long totalTicketsClotures;
    private Map<String, Long> ticketsParType;
    private Map<String, Long> ticketsResolusParTechnicien;
}