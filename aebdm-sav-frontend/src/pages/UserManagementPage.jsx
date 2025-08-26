import { useState, useEffect, useCallback } from 'react';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth'; // -- AJOUT -- Importer useAuth pour connaître l'utilisateur actuel

function UserManagementPage() {
  const { user: currentUser } = useAuth(); // -- AJOUT -- Récupérer l'utilisateur connecté
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Impossible de charger la liste des utilisateurs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // -- AJOUT -- Fonction pour gérer la suppression d'un utilisateur
  const handleDelete = async (userIdToDelete) => {
    // Demander confirmation avant de supprimer
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      try {
        await userService.deleteUser(userIdToDelete);
        // Rafraîchir la liste des utilisateurs pour que la ligne disparaisse
        fetchUsers();
      } catch (err) {
        alert("Erreur lors de la suppression de l'utilisateur.");
        console.error(err);
      }
    }
  };


  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestion des Utilisateurs</h1>
        <Link to="/admin/users/new">
          <Button variant="primary">+ Créer un Utilisateur</Button>
        </Link>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
        <th>Entreprise</th>
        <th>Fonction</th>
            <th>Rôle</th>
            <th>Actions</th> {/* -- AJOUT -- Nouvelle colonne pour les actions */}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nom}</td>
              <td>{user.email}</td>
              <td>{user.telephone}</td>
          <td>{user.entreprise}</td>
          <td>{user.fonction}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/admin/users/edit/${user.id}`}>
    <Button variant="warning" size="sm" className="me-2">Modifier</Button>
  </Link>
                {/* -- AJOUT -- Bouton Supprimer avec condition */}
                {/* On s'assure qu'un admin ne puisse pas se supprimer lui-même */}
                {currentUser?.email !== user.email && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default UserManagementPage;