package com.aebdm.savclient.dto;

import com.aebdm.savclient.enums.StatutTicket;
import lombok.Data;

@Data
public class UpdateStatusRequest {
    private StatutTicket statut;
}
