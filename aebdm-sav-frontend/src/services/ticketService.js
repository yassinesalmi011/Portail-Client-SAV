import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    return { headers: { 'Authorization': `Bearer ${token}` } };
  }
  return {};
};

const getTickets = () => {
  return axios.get(`${API_URL}/tickets`, getAuthHeaders());
};

const createTicket = (ticketData) => {
  return axios.post(`${API_URL}/tickets`, ticketData, getAuthHeaders());
};

const getTicketById = (id) => {
  return axios.get(`${API_URL}/tickets/${id}`, getAuthHeaders());
};

const addComment = (ticketId, commentData) => {
  return axios.post(`${API_URL}/tickets/${ticketId}/comments`, commentData, getAuthHeaders());
};

const updateStatus = (ticketId, statusData) => {
  return axios.put(`${API_URL}/tickets/${ticketId}/status`, statusData, getAuthHeaders());
};

// ===========================================
// ===       NOUVELLE FONCTION À AJOUTER     ===
// ===========================================
const assignTicket = (ticketId, assignData) => {
  // assignData sera un objet { technicienId: 123 }
  return axios.put(`${API_URL}/tickets/${ticketId}/assign`, assignData, getAuthHeaders());
};
const deleteTicket = (id) => {
  return axios.delete(`${API_URL}/tickets/${id}`, getAuthHeaders());
};
export default {
  getTickets,
  createTicket,
  getTicketById,
  addComment,
  updateStatus,
  assignTicket, // <-- Ne pas oublier de l'exporter
  deleteTicket
};