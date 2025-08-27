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

/*const createTicket = (ticketData) => {
  return axios.post(`${API_URL}/tickets`, ticketData, getAuthHeaders());
};
*/
const createTicket = (ticketData, file) => {
  // On crée un FormData
  const formData = new FormData();

  // On ajoute les champs texte
  formData.append('titre', ticketData.titre);
  formData.append('description', ticketData.description);
  formData.append('typeProbleme', ticketData.typeProbleme);

  // On ajoute le fichier s'il existe
  if (file) {
    formData.append('fichier', file);
  }
  
  const config = getAuthHeaders();
  // On doit préciser le type de contenu pour les fichiers
  config.headers['Content-Type'] = 'multipart/form-data';

  return axios.post(`${API_URL}/tickets`, formData, config);
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
const downloadFile = (fileName) => {
  const config = getAuthHeaders();
  // On dit à Axios que la réponse attendue est un fichier binaire (un "blob")
  config.responseType = 'blob'; 
  
  return axios.get(`${API_URL}/files/${fileName}`, config);
};
export default {
  getTickets,
  createTicket,
  getTicketById,
  addComment,
  updateStatus,
  assignTicket, // <-- Ne pas oublier de l'exporter
  deleteTicket,
  downloadFile 
};