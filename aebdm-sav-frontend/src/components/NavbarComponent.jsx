import { Navbar, Nav, Button, Container, NavDropdown   } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NavbarComponent() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

const handleLogout = () => { localStorage.removeItem('authToken'); navigate('/login'); window.location.reload(); };
  return (
    <Navbar bg="light" variant="light" expand="lg" className="border-bottom" style={{ boxShadow: '0 2px 4px rgba(0,0,0,.04)' }}>
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="fw-bold">
          <img alt="Logo" src="/logo.png" width="30" height="30" className="d-inline-block align-top me-2"/>
          Portail SAV AEBDM
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* ========================================================== */}
          {/* ===       LOGIQUE DE NAVIGATION AMÉLIORÉE ICI          === */}
          {/* ========================================================== */}
          <Nav className="me-auto">
            {/* Si l'utilisateur est un ADMIN, on affiche un menu déroulant */}
            {isAuthenticated && user?.role === 'ADMIN' ? (
              <NavDropdown title="Tableaux de Bord" id="admin-dashboard-dropdown">
                <NavDropdown.Item as={Link} to="/admin/dashboard">Vue Statistique</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/dashboard">Liste des Tickets</NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Sinon, on affiche le lien simple
              <Nav.Link as={Link} to="/dashboard">Tableau de Bord</Nav.Link>
            )}

            {/* Le lien "Gestion Utilisateurs" ne change pas */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Nav.Link as={Link} to="/admin/users">Gestion Utilisateurs</Nav.Link>
            )}
          </Nav>
          
          {/* --- Informations utilisateur à droite --- */}
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Connecté : <strong>{user.email}</strong> ({user.role})
                </Navbar.Text>
                <Button variant="outline-secondary" onClick={handleLogout}>Déconnexion</Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;