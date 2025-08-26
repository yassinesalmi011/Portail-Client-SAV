import { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import userService from '../services/userService';

function EditUserPage() {
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  const navigate = useNavigate();

  // Un seul état pour toutes les données du formulaire
  const [userData, setUserData] = useState({
    nom: '', email: '', telephone: '', fonction: '', entreprise: '', role: 'CLIENT', password: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Charger les données de l'utilisateur au premier affichage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id);
        // On remplit le formulaire avec les données existantes, en laissant le mot de passe vide
        setUserData({ ...response.data, password: '' });
      } catch (err) {
        setError("Impossible de charger les données de l'utilisateur.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]); // Se redéclenche si l'ID change

  // Handler générique pour tous les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Handler pour la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await userService.updateUser(id, userData);
      navigate('/admin/users'); // Rediriger vers la liste après succès
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'utilisateur.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={7}>
          <Link to="/admin/users">
            <Button variant="outline-secondary" className="mb-3">← Retour à la liste</Button>
          </Link>
          <Card>
            <Card.Header as="h4">Modifier l'Utilisateur : {userData.nom}</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                {/* =========================================== */}
                {/* ===     LE FORMULAIRE COMPLET EST ICI     === */}
                {/* =========================================== */}
                <Form.Group className="mb-3"><Form.Label>Nom Complet</Form.Label><Form.Control type="text" name="nom" value={userData.nom} onChange={handleInputChange} required /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Téléphone</Form.Label><Form.Control type="text" name="telephone" value={userData.telephone} onChange={handleInputChange} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Entreprise</Form.Label><Form.Control type="text" name="entreprise" value={userData.entreprise} onChange={handleInputChange} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Fonction</Form.Label><Form.Control type="text" name="fonction" value={userData.fonction} onChange={handleInputChange} /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={userData.email} onChange={handleInputChange} required /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Nouveau Mot de passe</Form.Label><Form.Control type="password" name="password" value={userData.password} onChange={handleInputChange} placeholder="Laisser vide pour ne pas changer" /></Form.Group>
                <Form.Group className="mb-3"><Form.Label>Rôle</Form.Label><Form.Select name="role" value={userData.role} onChange={handleInputChange}><option value="CLIENT">Client</option><option value="TECHNICIEN">Technicien</option><option value="ADMIN">Admin</option></Form.Select></Form.Group>
                
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" /> : "Enregistrer les modifications"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default EditUserPage;