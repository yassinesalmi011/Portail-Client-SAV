import axios from 'axios';

// L'URL de base de notre API
const API_URL = 'http://localhost:8080/api/dashboard';

// ===========================================
// ===       LA FONCTION MANQUANTE EST ICI     ===
// ===========================================
// Fonction utilitaire pour préparer les en-têtes d'authentification
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }
  return {};
};

/**
 * Appelle l'API pour récupérer les statistiques du tableau de bord.
 * @returns {Promise} La promesse de la requête Axios.
 */
const getStats = () => {
  // Maintenant, cet appel fonctionnera car getAuthHeaders() est défini
  return axios.get(`${API_URL}/stats`, getAuthHeaders());
};

// On exporte un objet contenant toutes les fonctions du service
export default {
  getStats
};