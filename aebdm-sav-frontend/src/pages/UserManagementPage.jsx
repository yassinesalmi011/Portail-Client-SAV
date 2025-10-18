import { useState, useEffect, useCallback } from 'react';
import { Container, Table, Alert, Spinner, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlusCircleFill, PencilSquare, Trash } from 'react-bootstrap-icons'; // <-- Importer les icônes
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

function UserManagementPage() {
  const { user: currentUser } = useAuth();
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

  const handleDelete = async (userIdToDelete) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await userService.deleteUser(userIdToDelete);
        fetchUsers();
      } catch (err) {
        alert("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;

  return (
    // On utilise un Container standard avec un padding vertical
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Gestion des Utilisateurs</h1>
        <Link to="/admin/users/new">
          <Button variant="primary" className="d-flex align-items-center">
            <PlusCircleFill className="me-2" />
            Nouvel Utilisateur
          </Button>
        </Link>
      </div>

      {/* On entoure le tableau d'une Card pour la cohérence visuelle */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped hover responsive="sm" className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Fonction</th>
                <th>Rôle</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="8" className="text-center p-4 text-muted">Aucun utilisateur trouvé.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td className="ps-3">{user.id}</td>
                    <td className="fw-bold">{user.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.telephone || '-'}</td> {/* Affiche '-' si le champ est vide */}
                    <td>{user.entreprise || '-'}</td>
                    <td>{user.fonction || '-'}</td>
                    <td>{user.role}</td>
                    <td className="text-center">
                      <Link to={`/admin/users/edit/${user.id}`}>
                        <Button variant="outline-warning" size="sm" className="me-2" title="Modifier">
                          <PencilSquare />
                        </Button>
                      </Link>
                      {currentUser?.email !== user.email && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)} title="Supprimer">
                          <Trash />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserManagementPage;