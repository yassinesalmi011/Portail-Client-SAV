import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col, Badge, ListGroup, Form, Tabs, Tab } from 'react-bootstrap';
import { ArrowLeft, ChatDotsFill, Paperclip, PencilSquare, Trash } from 'react-bootstrap-icons';
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

  // --- CORRECTION DE LA BOUCLE INFINIE ---
  // On utilise useCallback pour que la fonction ne soit pas recréée à chaque rendu
  const fetchTicketDetails = useCallback(async () => {
    try {
      setLoading(true);
      const ticketPromise = ticketService.getTicketById(id);
      const techniciansPromise = user?.role === 'ADMIN' ? userService.getTechnicians() : Promise.resolve({ data: [] });
      const [ticketResponse, techniciansResponse] = await Promise.all([ticketPromise, techniciansPromise]);
      setTicket(ticketResponse.data);
      setTechnicians(techniciansResponse.data);
      if (ticketResponse.data.technicienId) {
        setSelectedTechnician(ticketResponse.data.technicienId);
      }
    } catch (err) {
      setError('Impossible de charger les détails.');
    } finally {
      setLoading(false);
    }
  }, [id, user?.role]); // On se base sur l'ID et le rôle

  // useEffect ne dépend que de la fonction elle-même
  useEffect(() => {
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  // --- Implémentation complète des handlers ---
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
      await fetchTicketDetails(); // Rafraîchir
    } catch (err) { alert("Impossible d'ajouter le commentaire."); }
    finally { setIsSubmitting(false); }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await ticketService.updateStatus(id, { statut: newStatus });
      setTicket(response.data);
    } catch (error) { alert("Impossible de mettre à jour le statut."); }
  };

  const handleAssignTicket = async () => {
    if (!selectedTechnician) return alert("Veuillez sélectionner un technicien.");
    try {
      const response = await ticketService.assignTicket(id, { technicienId: selectedTechnician });
      setTicket(response.data);
      alert("Ticket assigné avec succès !");
    } catch (error) { alert("Impossible d'assigner le ticket."); }
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await ticketService.downloadFile(fileName);
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (error) { alert("Impossible de télécharger le fichier."); }
  };

  if (loading) return <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}><Spinner animation="border" style={{ width: '3rem', height: '3rem' }} /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!ticket) return <Container className="mt-4"><Alert variant="warning">Aucun ticket trouvé.</Alert></Container>;
 // Dans TicketDetailPage.jsx

return (
  <Container className="py-4">
    <Link to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}>
      <Button variant="outline-secondary" className="mb-3 d-flex align-items-center">
        <ArrowLeft className="me-2" />
        Retour au Tableau de Bord
      </Button>
    </Link>

    {/* --- CARTE D'EN-TÊTE PRINCIPALE (STYLE IMAGE 2) --- */}
    <Card className="shadow-sm mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Ticket #{ticket.id} - {ticket.titre}</h4>
        <Badge bg={getStatusBadgeVariant(ticket.statut)} pill className="fs-6">{ticket.statut.replace('_', ' ')}</Badge>
      </Card.Header>
      <Card.Body>
        {/* On utilise une Row à l'intérieur de la Card pour séparer les infos */}
        <Row>
          {/* Colonne pour les infos de base */}
          <Col md={7}>
            <p><strong>Client :</strong> {ticket.nomClient}</p>
            <p><strong>Créé le :</strong> {new Date(ticket.dateCreation).toLocaleString('fr-FR')}</p>
            {ticket.nomFichier && (
              <p>
                <strong>Pièce Jointe :</strong>
                <Button variant="link" size="sm" onClick={() => handleFileDownload(ticket.nomFichier)}><Paperclip className="me-1"/>Voir le fichier</Button>
              </p>
            )}
          </Col>
          {/* Colonne pour les infos secondaires */}
          <Col md={5}>
            <p><strong>Type :</strong> {ticket.typeProbleme}</p>
            <p><strong>Technicien :</strong> {ticket.nomTechnicien || 'Non assigné'}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>

    {/* --- SYSTÈME D'ONGLETS (STYLE IMAGE 1) --- */}
    <Tabs defaultActiveKey="communication" id="ticket-details-tabs" className="mb-3">

      <Tab eventKey="communication" title="Description & Communications">
        <Card className="shadow-sm">
          <Card.Body>
            <h5>Description du Problème</h5>
            <p className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
            <hr />
            <h5 className="mt-4 d-flex align-items-center"><ChatDotsFill className="me-2" />Historique des Commentaires</h5>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map(comment => (
                    <ListGroup.Item key={comment.id} className="px-0">
                      <div className="d-flex w-100 justify-content-between"><p className="mb-1 fw-bold">{comment.nomAuteur}</p><small className="text-muted">{new Date(comment.dateCreation).toLocaleString('fr-FR')}</small></div>
                      <p className="mb-1">{comment.contenu}</p>
                    </ListGroup.Item>
                  ))
                ) : (<p className="text-muted">Aucun commentaire pour ce ticket.</p>)}
              </ListGroup>
            </div>
            <hr />
            <Form onSubmit={handleCommentSubmit}>
              <Form.Group className="mb-3"><Form.Label>Ajouter une réponse</Form.Label><Form.Control as="textarea" rows={3} placeholder="Écrivez votre message..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required /></Form.Group>
              <Button variant="primary" type="submit" disabled={isSubmitting}>{isSubmitting ? <Spinner size="sm" /> : 'Envoyer'}</Button>
            </Form>
          </Card.Body>
        </Card>
      </Tab>

      {(user?.role === 'ADMIN' || user?.role === 'TECHNICIEN') && (
        <Tab eventKey="administration" title="Administration">
          <Card className="shadow-sm">
            <Card.Header><h5 className="mb-0">Actions</h5></Card.Header>
            <Card.Body>
              <Form.Group className="mb-3"><Form.Label className="fw-bold">Changer le statut</Form.Label><Form.Select value={ticket.statut} onChange={(e) => handleStatusChange(e.target.value)}><option>OUVERT</option><option>EN_COURS</option><option>EN_ATTENTE_CLIENT</option><option>CLOTURE</option></Form.Select></Form.Group>
              {user?.role === 'ADMIN' && (
                <Form.Group><Form.Label className="fw-bold">Assigner à un technicien</Form.Label><Form.Select value={selectedTechnician} onChange={(e) => setSelectedTechnician(e.target.value)}><option value="">-- Sélectionner --</option>{technicians.map(tech => (<option key={tech.id} value={tech.id}>{tech.nom}</option>))}</Form.Select><Button variant="info" size="sm" onClick={handleAssignTicket} className="mt-2 w-100">Assigner</Button></Form.Group>
              )}
            </Card.Body>
          </Card>
        </Tab>
      )}
    </Tabs>
  </Container>
);
}

export default TicketDetailPage;