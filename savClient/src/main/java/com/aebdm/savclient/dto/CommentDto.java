package com.aebdm.savclient.dto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String contenu;
    private LocalDateTime dateCreation;
    private String nomAuteur;
}
