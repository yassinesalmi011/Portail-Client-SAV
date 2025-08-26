// src/pages/CreateUserPage.jsx
import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

function CreateUserPage() {
const [newUser, setNewUser] = useState({ nom: '', email: '', password: '', role: 'CLIENT', telephone: '', 
     fonction: '', entreprise: '' });
const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await authService.register(newUser);
      navigate('/admin/users'); // Rediriger vers la liste après succès
    } catch (err) {
      setError("Erreur lors de la création de l'utilisateur.");
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={7}>
          <Link to="/admin/users">
            <Button variant="outline-secondary" className="mb-3">← Retour à la liste</Button>
          </Link>
          <Card>
            <Card.Header as="h4">Créer un Nouvel Utilisateur</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* ... (copiez les 4 Form.Group de l'ancien formulaire ici) ... */}
                <Form.Group className="mb-3">
                  <Form.Label>Nom Complet</Form.Label>
                  <Form.Control type="text" name="nom" value={newUser.nom} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control type="text" name="telephone" value={newUser.telephone} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Entreprise</Form.Label>
                  <Form.Control type="text" name="entreprise" value={newUser.entreprise} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fonction</Form.Label>
                  <Form.Control type="text" name="fonction" value={newUser.fonction} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" name="password" value={newUser.password} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rôle</Form.Label>
                  <Form.Select name="role" value={newUser.role} onChange={handleInputChange}>
                    <option value="CLIENT">Client</option>
                    <option value="TECHNICIEN">Technicien</option>
                    <option value="ADMIN">Admin</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" /> : "Créer l'utilisateur"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateUserPage;