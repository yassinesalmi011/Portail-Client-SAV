package com.aebdm.savclient.dto;


import lombok.Data;

@Data
public class CreateTicketRequest {
    private String titre;
    private String description;
    private String typeProbleme;
}