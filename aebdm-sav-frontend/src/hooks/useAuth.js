import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return { user: null, isAuthenticated: false };
  }

  try {
    // On décode le token
    const decodedToken = jwtDecode(token);

    // On vérifie si le token a expiré
    // La date d'expiration (exp) est en secondes, on la convertit en millisecondes
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken"); // Nettoyer le token expiré
      return { user: null, isAuthenticated: false };
    }

    // Si on arrive ici, le token est valide et non expiré
    // On extrait les informations
    const user = {
      email: decodedToken.sub,
      role: decodedToken.role, // On lit le rôle directement
    };

    return { user, isAuthenticated: true };

  } catch (error) {
    // Si le token est malformé, on le nettoie
    console.error("Erreur de décodage du token :", error);
    localStorage.removeItem("authToken");
    return { user: null, isAuthenticated: false };
  }
};