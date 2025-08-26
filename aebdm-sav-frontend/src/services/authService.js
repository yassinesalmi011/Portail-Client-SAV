import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Fonction utilitaire pour obtenir les en-têtes (on en aura besoin pour register)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { headers: { 'Authorization': `Bearer ${token}` } };
  }
  return {};
};

/**
 * Appelle l'API pour connecter un utilisateur.
 * @param {object} credentials - Un objet avec email et password.
 * @returns {Promise} La promesse de la requête Axios.
 */
const login = (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

/**
 * Appelle l'API pour enregistrer un nouvel utilisateur (action de l'admin).
 * @param {object} userData - Un objet avec nom, email, password, role.
 * @returns {Promise} La promesse de la requête Axios.
 */
const register = (userData) => {
  return axios.post(`${API_URL}/auth/register`, userData, getAuthHeaders());
};

export default {
  login,
  register
};  