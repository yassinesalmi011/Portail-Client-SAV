# Portail Client SAV - Backend (Spring Boot)

Ce projet constitue la partie backend (API RESTful) de l'application "Portail Client SAV". Développé avec Spring Boot, il gère toute la logique métier, la sécurité et l'interaction avec la base de données.

---

## ✨ Fonctionnalités Clés

- **API RESTful Complète :** Endpoints pour la gestion des tickets, des utilisateurs, des commentaires, etc.
- **Sécurité Robuste :** Authentification par token **JWT** et gestion des autorisations basée sur 3 rôles (Client, Technicien, Administrateur) avec Spring Security.
- **Gestion de Données :** Opérations CRUD complètes avec Spring Data JPA et Hibernate.
- **Fonctionnalités Avancées :**
  - **Notifications par Email :** Envoi automatique d'emails lors des mises à jour de tickets.
  - **Gestion de Fichiers :** Upload et service de téléchargement sécurisé pour les pièces jointes.
  - **Statistiques :** Endpoint dédié au calcul des KPIs pour le dashboard administrateur.
  - **Recherche & Filtrage :** API dynamique pour rechercher et filtrer les tickets selon plusieurs critères.

---

## 🛠️ Pile Technologique

- **Langage :** Java 17
- **Framework :** Spring Boot
- **Sécurité :** Spring Security
- **Accès aux Données :** Spring Data JPA, Hibernate
- **Base de Données :** MySQL
- **Gestion des Dépendances :** Maven
- **Authentification :** JSON Web Tokens (JWT)
- **Emails :** Spring Boot Mail Starter
- **Tests API :** Postman

---

## 🚀 Démarrage Rapide

### Prérequis

- JDK 17 ou supérieur
- Maven 3.x
- Un serveur MySQL en cours d'exécution (ex: via XAMPP)

### Configuration

1.  **Clonez le dépôt :**
    ```bash
    git clone [URL_DE_VOTRE_DEPOT_BACKEND]
    ```
2.  **Ouvrez le projet** dans votre IDE (ex: IntelliJ IDEA).
3.  **Configurez la base de données et le serveur mail :**
    - Ouvrez le fichier `src/main/resources/application.properties`.
    - Mettez à jour les informations suivantes avec vos propres identifiants :
      ```properties
      # Base de données
      spring.datasource.url=jdbc:mysql://localhost:3306/aebdm_sav_db
      spring.datasource.username=root
      spring.datasource.password=

      # Serveur Mail (Gmail)
      spring.mail.username=votre-email@gmail.com
      spring.mail.password=votre-mot-de-passe-application
      ```

### Lancement

- Exécutez la méthode `main` de la classe `SavClientApplication.java`.
- Le serveur démarrera par défaut sur `http://localhost:8080`.

---

## Auteur

- **SALMI Yassine** - [LinkedIn](https://linkedin.com/in/yassinesalmi)