package com.aebdm.savclient.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    // Le chemin vers notre dossier "uploads"
    private final Path fileStorageLocation;

    public FileStorageService() {
        // "user.dir" est la racine de notre projet
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

        try {
            // On s'assure que le dossier existe
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Impossible de créer le dossier de stockage.", ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // 1. Nettoyer le nom du fichier
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Vérifier que le nom de fichier est valide
            if (originalFileName.contains("..")) {
                throw new RuntimeException("Le nom de fichier contient une séquence invalide " + originalFileName);
            }

            // 2. Créer un nom de fichier unique pour éviter les conflits
            String fileExtension = "";
            try {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            } catch(Exception e) {
                fileExtension = "";
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            // 3. Copier le fichier dans notre dossier de stockage
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 4. Renvoyer le nom unique du fichier pour le sauvegarder en base de données
            return uniqueFileName;

        } catch (IOException ex) {
            throw new RuntimeException("Impossible de stocker le fichier " + originalFileName, ex);
        }
    }
}