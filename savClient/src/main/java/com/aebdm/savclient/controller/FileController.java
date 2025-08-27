package com.aebdm.savclient.controller;

import com.aebdm.savclient.service.FileStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import jakarta.servlet.http.HttpServletRequest; // Nouvel import
import java.io.IOException; // Nouvel import

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final Path fileStorageLocation;

    public FileController() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) { // Ajouter HttpServletRequest
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // --- AMÉLIORATION ICI ---
                String contentType = null;
                try {
                    // On laisse Spring essayer de déterminer le type de fichier
                    contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                } catch (IOException ex) {
                    // On ignore si on ne peut pas le déterminer
                }
                // Si on ne trouve pas de type, on utilise un type par défaut
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                // --- FIN DE L'AMÉLIORATION ---

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType)) // Utiliser le type trouvé
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}