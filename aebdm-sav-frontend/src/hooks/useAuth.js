import { jwtDecode } from 'jwt-decode'; // Correction de l'import

// Ce "hook" est une fonction qui nous donnera facilement les infos sur l'utilisateur connecté
export const useAuth = () => {
  const token = localStorage.getItem('authToken');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      // NOTE: Assurez-vous que votre backend inclut bien le rôle dans le token !
      // Pour l'instant, on va le déduire de l'email pour l'exemple.
      // Idéalement, le backend devrait ajouter le rôle directement.
      const userEmail = decodedToken.sub; // 'sub' est le champ standard pour le "subject" (l'email)
      
      // Logique de déduction simple (à améliorer côté backend plus tard)
      let role = 'CLIENT';
      if (userEmail.includes('admin')) {
        role = 'ADMIN';
      } else if (userEmail.includes('tech')) {
        // Supposons qu'un email de technicien contient "tech"
        role = 'TECHNICIEN';
      }

      return { user: { email: userEmail, role: role }, isAuthenticated: true };

    } catch (error) {
      console.error("Token invalide:", error);
      // Si le token est invalide, on le supprime
      localStorage.removeItem('authToken');
      return { user: null, isAuthenticated: false };
    }
  }

  return { user: null, isAuthenticated: false };
};