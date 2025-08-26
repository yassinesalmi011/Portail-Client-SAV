import axios from 'axios';

// L'URL de base de notre API
const API_URL = 'http://localhost:8080/api';

// On peut réutiliser cette fonction pratique
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { headers: { 'Authorization': `Bearer ${token}` } };
  }
  return {};
};

// Fonction pour récupérer la liste de tous les techniciens
const getTechnicians = () => {
  return axios.get(`${API_URL}/users/technicians`, getAuthHeaders());
};
const getAllUsers = () => {
  return axios.get(`${API_URL}/users`, getAuthHeaders());
};
const deleteUser = (id) => {
  return axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
};
const getUserById = (id) => {
  return axios.get(`${API_URL}/users/${id}`, getAuthHeaders());
};

const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/users/${id}`, userData, getAuthHeaders());
};
// On exporte la fonction pour pouvoir l'utiliser ailleurs
export default {
  getTechnicians,
  getAllUsers,
  deleteUser,
  getUserById,
  updateUser
};