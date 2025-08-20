import React from 'react';
import { Navigate } from 'react-router-dom';

// Ce composant prend un "enfant" (la page à protéger) comme propriété
function ProtectedRoute({ children }) {
  // On vérifie si le token existe dans le localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Si PAS de token, on redirige l'utilisateur vers la page de login
    return <Navigate to="/login" />;
  }

  // Si le token existe, on affiche l'enfant (la page demandée)
  return children;
}

export default ProtectedRoute;