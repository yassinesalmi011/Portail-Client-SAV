import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function NavbarComponent() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    // On peut souvent se passer du reload si la gestion d'état est bonne,
    // mais pour ce projet, c'est une solution simple et efficace.
    window.location.reload(); 
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4"> {/* Ajout d'une marge en bas */}
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">Portail SAV AEBDM</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* On déplace la Nav à gauche */}
          <Nav className="me-auto">
            {/* Lien vers le tableau de bord principal */}
            <Nav.Link as={Link} to="/dashboard">Tableau de Bord</Nav.Link>
            
            {/* =========================================== */}
            {/* ===    NOUVEAU LIEN POUR L'ADMIN ICI    === */}
            {/* =========================================== */}
            {/* Ce lien ne s'affiche que si l'utilisateur est connecté ET a le rôle ADMIN */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Nav.Link as={Link} to="/admin/users">
                Gestion Utilisateurs
              </Nav.Link>
            )}
          </Nav>
          
          {/* Section de droite pour l'utilisateur et la déconnexion */}
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  {user.email} ({user.role}) {/* On peut aussi afficher le rôle */}
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Déconnexion</Button>
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