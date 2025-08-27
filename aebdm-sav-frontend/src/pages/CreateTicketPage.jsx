import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ticketService from '../services/ticketService';  
function CreateTicketPage() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [typeProbleme, setTypeProbleme] = useState('');
  const [file, setFile] = useState(null); // <-- NOUVEL ÉTAT
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const ticketData = { titre, description, typeProbleme };
     await ticketService.createTicket(ticketData, file); 
    
    // Si l'appel réussit, on redirige vers le tableau de bord
    navigate('/dashboard');
 setTimeout(() => window.location.reload(), 100); 
  } catch (err) {
    setError('Erreur lors de la création du ticket. Veuillez réessayer.');
    console.error(err);
    setLoading(false);
  }
};

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h2 className="text-center mb-4">Créer un Nouveau Ticket</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre du problème</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Impossible d'imprimer"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type de problème</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Matériel, Logiciel, Réseau..."
                value={typeProbleme}
                onChange={(e) => setTypeProbleme(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description détaillée</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Veuillez décrire le problème le plus précisément possible..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Pièce Jointe (optionnel)</Form.Label>
  <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
</Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => navigate('/dashboard')} className="me-2">
                Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Créer le Ticket'}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateTicketPage;