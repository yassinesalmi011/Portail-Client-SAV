import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTicketPage from './pages/CreateTicketPage';
import ProtectedRoute from './components/ProtectedRoute';
import TicketDetailPage from './pages/TicketDetailPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique pour la connexion */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route protégée pour le tableau de bord */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Route protégée pour la création de ticket */}
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
<Route
  path="/tickets/:id" // Le :id est un paramètre dynamique
  element={
    <ProtectedRoute>
      <TicketDetailPage />
    </ProtectedRoute>
  }
/>
        {/* Redirection : si l'utilisateur arrive à la racine "/",
            on le redirige vers la page de connexion. */}
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;