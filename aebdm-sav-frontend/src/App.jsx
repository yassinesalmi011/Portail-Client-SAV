import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import des pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';

// Import des composants de structure
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout'; // <-- S'assurer que le Layout est importé
import UserManagementPage from './pages/UserManagementPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Les routes publiques n'ont PAS de Layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirection par défaut vers /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* --- Routes Protégées --- */}
        {/* Chaque page protégée est maintenant un "enfant" du composant Layout */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTicketPage />
              </Layout>
            </ProtectedRoute>
          }
        />
<Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <Layout><UserManagementPage /></Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/users/new"
  element={
    <ProtectedRoute>
      <Layout><CreateUserPage /></Layout>
    </ProtectedRoute>
  }
/>  
<Route
  path="/admin/users/edit/:id"
  element={
    <ProtectedRoute>
      <Layout><EditUserPage /></Layout>
    </ProtectedRoute>
  }
/>
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;