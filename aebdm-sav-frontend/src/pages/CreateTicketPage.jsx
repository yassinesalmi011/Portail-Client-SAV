import { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import ticketService from '../services/ticketService';
import { useAuth } from '../hooks/useAuth'; // On en aura besoin pour la redirection

function CreateTicketPage() {
  const { user } = useAuth();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [typeProbleme, setTypeProbleme] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const ticketData = { titre, description, typeProbleme };
      await ticketService.createTicket(ticketData, file);
      // On redirige vers le bon tableau de bord
      const dashboardUrl = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
      navigate(dashboardUrl);
    } catch (err) {
      setError("Erreur lors de la création du ticket. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  const dashboardUrl = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Link to={dashboardUrl}>
            <Button variant="outline-secondary" className="mb-3 d-flex align-items-center">
              <ArrowLeft className="me-2" />
              Annuler et Retourner au Tableau de Bord
            </Button>
          </Link>
          <Card className="shadow-sm">
            <Card.Header as="h3" className="fw-normal">
              Signaler un nouveau problème
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Titre du problème</Form.Label>
                      <Form.Control type="text" placeholder="Ex: Impossible d'imprimer" value={titre} onChange={(e) => setTitre(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Type de problème</Form.Label>
                      <Form.Control type="text" placeholder="Ex: Matériel, Logiciel, Réseau..." value={typeProbleme} onChange={(e) => setTypeProbleme(e.target.value)} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description détaillée</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Veuillez décrire le problème le plus précisément possible, incluant les messages d'erreur éventuels..." value={description} onChange={(e) => setDescription(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pièce Jointe (optionnel)</Form.Label>
                  <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                </Form.Group>

                <div className="text-end">
                  <Button variant="primary" type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Soumettre le Ticket'}
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

export default CreateTicketPage;