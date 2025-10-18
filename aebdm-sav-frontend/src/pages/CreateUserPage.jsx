import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PersonPlusFill } from 'react-bootstrap-icons';
import authService from '../services/authService';

function CreateUserPage() {
  const [newUser, setNewUser] = useState({ nom: '', email: '', password: '', role: 'CLIENT', telephone: '', fonction: '', entreprise: '' });
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
      navigate('/admin/users');
    } catch (err) {
      setError("Erreur : Impossible de créer l'utilisateur. L'email existe peut-être déjà.");
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Le bouton de retour est plus discret et informatif */}
          <Link to="/admin/users" className="text-decoration-none text-muted d-inline-flex align-items-center mb-3">
            <ArrowLeft className="me-2" />
            Retour à la liste des utilisateurs
          </Link>

          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-md-5">
              
              {/* --- EN-TÊTE DU FORMULAIRE --- */}
              <div className="mb-4">
                <h2 className="fw-bold">Créer un Nouvel Utilisateur</h2>
                <p className="text-muted">Remplissez les informations ci-dessous pour ajouter un nouveau membre.</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                {/* On regroupe les champs par thèmes avec des titres de section */}
                <h5 className="mb-3 text-primary">Informations Personnelles</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Nom Complet</Form.Label>
                    <Form.Control type="text" name="nom" value={newUser.nom} onChange={handleInputChange} required size="lg" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={newUser.email} onChange={handleInputChange} required size="lg" />
                  </Form.Group>
                </Row>
                
                <h5 className="mb-3 text-primary mt-4">Informations Professionnelles</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Téléphone</Form.Label>
                    <Form.Control type="tel" name="telephone" value={newUser.telephone} onChange={handleInputChange} size="lg" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Entreprise</Form.Label>
                    <Form.Control type="text" name="entreprise" value={newUser.entreprise} onChange={handleInputChange} size="lg" />
                  </Form.Group>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Fonction / Poste</Form.Label>
                  <Form.Control type="text" name="fonction" value={newUser.fonction} onChange={handleInputChange} size="lg" />
                </Form.Group>

                <h5 className="mb-3 text-primary mt-4">Accès et Permissions</h5>
                <Row>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control type="password" name="password" value={newUser.password} onChange={handleInputChange} required size="lg" />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>Rôle</Form.Label>
                    <Form.Select name="role" value={newUser.role} onChange={handleInputChange} size="lg">
                      <option value="CLIENT">Client</option>
                      <option value="TECHNICIEN">Technicien</option>
                      <option value="ADMIN">Admin</option>
                    </Form.Select>
                  </Form.Group>
                </Row>
                
                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={isSubmitting} size="lg" className="d-flex align-items-center">
                    <PersonPlusFill className="me-2" />
                    {isSubmitting ? 'Création en cours...' : "Créer l'utilisateur"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateUserPage;