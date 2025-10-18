import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'react-bootstrap-icons'; // On change l'icône du bouton
import userService from '../services/userService';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ nom: '', email: '', telephone: '', fonction: '', entreprise: '', role: 'CLIENT', password: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Charger les données de l'utilisateur au premier affichage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id);
        setUserData({ ...response.data, password: '' }); // On ne pré-remplit jamais le mot de passe
      } catch (err) {
        setError("Impossible de charger les données de l'utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await userService.updateUser(id, userData);
      navigate('/admin/users');
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Link to="/admin/users" className="text-decoration-none text-muted d-inline-flex align-items-center mb-3">
            <ArrowLeft className="me-2" />
            Retour à la liste des utilisateurs
          </Link>

          <Card className="shadow-lg border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="mb-4">
                <h2 className="fw-bold">Modifier l'Utilisateur</h2>
                <p className="text-muted">Mettez à jour les informations de {userData.nom}.</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                <h5 className="mb-3 text-primary">Informations Personnelles</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Nom Complet</Form.Label><Form.Control type="text" name="nom" value={userData.nom} onChange={handleInputChange} required size="lg" /></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={userData.email} onChange={handleInputChange} required size="lg" /></Form.Group>
                </Row>
                
                <h5 className="mb-3 text-primary mt-4">Informations Professionnelles</h5>
                <Row className="mb-3">
                  <Form.Group as={Col} md={6}><Form.Label>Téléphone</Form.Label><Form.Control type="tel" name="telephone" value={userData.telephone} onChange={handleInputChange} size="lg" /></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Entreprise</Form.Label><Form.Control type="text" name="entreprise" value={userData.entreprise} onChange={handleInputChange} size="lg" /></Form.Group>
                </Row>
                <Form.Group className="mb-3"><Form.Label>Fonction / Poste</Form.Label><Form.Control type="text" name="fonction" value={userData.fonction} onChange={handleInputChange} size="lg" /></Form.Group>

                <h5 className="mb-3 text-primary mt-4">Accès et Permissions</h5>
                <Row>
                  <Form.Group as={Col} md={6}><Form.Label>Nouveau Mot de passe</Form.Label><Form.Control type="password" name="password" value={userData.password} onChange={handleInputChange} size="lg" placeholder="Laisser vide pour ne pas changer" /></Form.Group>
                  <Form.Group as={Col} md={6}><Form.Label>Rôle</Form.Label><Form.Select name="role" value={userData.role} onChange={handleInputChange} size="lg"><option value="CLIENT">Client</option><option value="TECHNICIEN">Technicien</option><option value="ADMIN">Admin</option></Form.Select></Form.Group>
                </Row>
                
                <hr className="my-4" />

                <div className="d-flex justify-content-end">
                  <Button variant="success" type="submit" disabled={isSubmitting} size="lg" className="d-flex align-items-center">
                    <Save className="me-2" />
                    {isSubmitting ? 'Enregistrement...' : "Enregistrer les modifications"}
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

export default EditUserPage;