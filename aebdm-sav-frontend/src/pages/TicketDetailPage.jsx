import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col, Badge, ListGroup, Form } from 'react-bootstrap';
import ticketService from '../services/ticketService';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

function TicketDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');

  const fetchTicketDetails = useCallback(async () => {
    // Ne pas remettre setLoading à true ici pour éviter un clignotement lors du refresh
    try {
      const ticketPromise = ticketService.getTicketById(id);
      const techniciansPromise = user?.role === 'ADMIN' ? userService.getTechnicians() : Promise.resolve({ data: [] });
      const [ticketResponse, techniciansResponse] = await Promise.all([ticketPromise, techniciansPromise]);
      setTicket(ticketResponse.data);
      setTechnicians(techniciansResponse.data);
      if (ticketResponse.data.technicienId) {
        setSelectedTechnician(ticketResponse.data.technicienId);
      }
    } catch (err) {
      setError('Impossible de charger les détails du ticket.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.role]);

  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'OUVERT': return 'danger';
      case 'EN_COURS': return 'warning';
      case 'EN_ATTENTE_CLIENT': return 'info';
      case 'CLOTURE': return 'success';
      default: return 'secondary';
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await ticketService.addComment(id, { contenu: newComment });
      setNewComment('');
      await fetchTicketDetails(); // Rafraîchir toutes les données
    } catch (err) {
      alert("Impossible d'ajouter le commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await ticketService.updateStatus(id, { statut: newStatus });
      setTicket(response.data);
    } catch (error) {
      alert("Impossible de mettre à jour le statut.");
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTechnician) return alert("Veuillez sélectionner un technicien.");
    try {
      const response = await ticketService.assignTicket(id, { technicienId: selectedTechnician });
      setTicket(response.data);
      alert("Ticket assigné avec succès !");
    } catch (error) {
      alert("Impossible d'assigner le ticket.");
    }
  };

  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!ticket) return <Container><Alert variant="warning">Aucun ticket trouvé.</Alert></Container>;

  return (
    <Container className="mt-4">
      <Link to="/dashboard"><Button variant="outline-secondary" className="mb-3">← Retour</Button></Link>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Ticket #{ticket.id} - {ticket.titre}</h3>
            <Badge bg={getStatusBadgeVariant(ticket.statut)} pill>{ticket.statut}</Badge>
          </div>
        </Card.Header>
        {/* =========================================== */}
        {/* ===    LE CONTENU DE LA CARD RESTAURÉ     === */}
        {/* =========================================== */}
        <Card.Body>
          <Row>
            <Col md={6}><p><strong>Client :</strong> {ticket.nomClient}</p><p><strong>Date de Création :</strong> {new Date(ticket.dateCreation).toLocaleString('fr-FR')}</p></Col>
            <Col md={6}><p><strong>Type de Problème :</strong> {ticket.typeProbleme}</p><p><strong>Technicien Assigné :</strong> {ticket.nomTechnicien || 'Non assigné'}</p></Col>
          </Row>

          {(user?.role === 'ADMIN' || user?.role === 'TECHNICIEN') && <hr />}

          {(user?.role === 'ADMIN' || user?.role === 'TECHNICIEN') && (
            <Form.Group as={Row} className="align-items-center mb-3">
              <Form.Label column sm="3" className="fw-bold">Changer le statut :</Form.Label>
              <Col sm={9}>
                <Form.Select value={ticket.statut} onChange={(e) => handleStatusChange(e.target.value)}>
                  <option value="OUVERT">Ouvert</option>
                  <option value="EN_COURS">En Cours</option>
                  <option value="EN_ATTENTE_CLIENT">En Attente Client</option>
                  <option value="CLOTURE">Clôturé</option>
                </Form.Select>
              </Col>
            </Form.Group>
          )}

          {user?.role === 'ADMIN' && (
            <Form.Group as={Row} className="align-items-center">
              <Form.Label column sm="3" className="fw-bold">Assigner à :</Form.Label>
              <Col sm={6}>
                <Form.Select value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}>
                  <option value="">-- Sélectionner un technicien --</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.nom}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={3}>
                <Button variant="info" onClick={handleAssignTicket} className="w-100">Assigner</Button>
              </Col>
            </Form.Group>
          )}

          <hr />
          <h5>Description</h5>
          <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Header><h4>Historique des Communications</h4></Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            {ticket.comments && ticket.comments.length > 0 ? (
              ticket.comments.map(comment => (
                <ListGroup.Item key={comment.id} className="mb-2 border-0 px-0">
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{comment.nomAuteur}</h6>
                    <small>{new Date(comment.dateCreation).toLocaleString('fr-FR')}</small>
                  </div>
                  <p className="mb-1">{comment.contenu}</p>
                </ListGroup.Item>
              ))
            ) : (<p>Aucun commentaire pour ce ticket.</p>)}
          </ListGroup>
          <hr />
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><h5>Ajouter une réponse</h5></Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Écrivez votre message ici..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Envoyer'}</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TicketDetailPage;