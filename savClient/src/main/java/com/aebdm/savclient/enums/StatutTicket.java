package com.aebdm.savclient.enums;

public enum StatutTicket {
    OUVERT,
    EN_COURS,
    EN_ATTENTE_CLIENT,
    CLOTURE
    // Note: J'ai enlevé "ASSIGNE" et "RESOLU" pour simplifier
    // le cycle de vie pour un projet d'un mois, mais on peut les rajouter si besoin.
    // Un ticket est "OUVERT" et on lui assigne un technicien, il peut rester "OUVERT".
}
