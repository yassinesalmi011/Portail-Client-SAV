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

  // Utilisation de useCallback pour mémoriser la fonction et éviter les re-chargements infinis
  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
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


  // --- Fonctions de gestion (handlers) ---
  const getStatusBadgeVariant = (status) => { /* ... (inchangé) ... */ };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await ticketService.addComment(id, { contenu: newComment });
      setNewComment('');
      // On rafraîchit les données pour voir le nouveau commentaire
      fetchTicketDetails(); 
    } catch (err) {
      alert("Impossible d'ajouter le commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleStatusChange = async (newStatus) => { /* ... (inchangé) ... */ };
  const handleAssignTicket = async () => { /* ... (inchangé) ... */ };


  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!ticket) return <Container><Alert variant="warning">Aucun ticket trouvé.</Alert></Container>;

  return (
    <Container className="mt-4">
      <Link to="/dashboard"><Button variant="outline-secondary" className="mb-3">← Retour</Button></Link>

      {/* Card des détails du ticket (inchangée) */}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h3>Ticket #{ticket.id} - {ticket.titre}</h3>
            <Badge bg={getStatusBadgeVariant(ticket.statut)} pill>{ticket.statut}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
            {/* ... (le contenu de la card des détails est inchangé) ... */}
        </Card.Body>
      </Card>

      {/* =========================================== */}
      {/* ===       LA SECTION COMMENTAIRES         === */}
      {/* =========================================== */}
      <Card className="mt-4">
        <Card.Header>
          <h4>Historique des Communications</h4>
        </Card.Header>
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
            ) : (
              <p>Aucun commentaire pour ce ticket.</p>
            )}
          </ListGroup>
          <hr />
          <Form onSubmit={handleCommentSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><h5>Ajouter une réponse</h5></Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Écrivez votre message ici..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : 'Envoyer'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TicketDetailPage;