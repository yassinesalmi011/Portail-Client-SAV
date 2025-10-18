# Portail Client SAV - Frontend (React)

Ce projet constitue la partie frontend (interface utilisateur) de l'application "Portail Client SAV". Développée avec React, c'est une Single Page Application (SPA) qui communique avec l'API backend pour offrir une expérience utilisateur fluide et réactive.

---

## ✨ Fonctionnalités Clés

- **Interface Intuitive et Moderne :** Design professionnel et responsive grâce à **React-Bootstrap**.
- **Navigation Protégée :** Routage géré par **React Router DOM** avec des routes protégées pour les utilisateurs authentifiés.
- **Affichage Dynamique par Rôle :** L'interface s'adapte en temps réel pour afficher les menus et les actions autorisées pour le Client, le Technicien ou l'Administrateur.
- **Tableaux de Bord :**
  - Dashboard principal avec **recherche et filtrage** dynamiques.
  - Dashboard **statistique** pour l'admin avec des graphiques interactifs (Chart.js).
- **CRUD Complet :** Interfaces pour gérer les tickets (création, détail) et les utilisateurs (création, modification, suppression).
- **Interactivité :** Mises à jour instantanées de l'interface après une action, et gestion de l'upload de fichiers.

---

## 🛠️ Pile Technologique

- **Bibliothèque :** React
- **Outil de Build :** Vite
- **Routage :** React Router DOM
- **Client HTTP :** Axios
- **Design & Composants :** React-Bootstrap, React-Bootstrap-Icons
- **Graphiques :** Chart.js, react-chartjs-2
- **Gestion des Paquets :** npm

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (version 18 ou supérieure) et npm
- Le **serveur backend doit être en cours d'exécution** pour que l'application puisse fonctionner.

### Lancement

1.  **Clonez le dépôt :**
    ```bash
    git clone [URL_DE_VOTRE_DEPOT_FRONTEND]
    cd aebdm-sav-frontend
    ```
2.  **Installez les dépendances :**
    ```bash
    npm install
    ```
3.  **Démarrez le serveur de développement :**
    ```bash
    npm run dev
    ```
    - L'application sera accessible par défaut à l'adresse `http://localhost:5173`.

---

## Auteur

- **SALMI Yassine** - [LinkedIn](https://linkedin.com/in/yassinesalmi)
