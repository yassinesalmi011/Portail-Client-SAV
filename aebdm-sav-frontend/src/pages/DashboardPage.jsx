import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Button, Form, Row, Col, Card, Badge } from 'react-bootstrap';
import { PlusCircleFill, Trash, Paperclip } from 'react-bootstrap-icons'; // Importer les icônes
import ticketService from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { searchTerm: searchTerm || null, statut: statusFilter || null };
      const response = await ticketService.getTickets(params);
      setTickets(response.data);
    } catch (err) {
      setError('Impossible de charger les tickets.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleTicketDelete = async (ticketId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      try {
        await ticketService.deleteTicket(ticketId);
        fetchTickets();
      } catch (err) {
        alert("Erreur lors de la suppression du ticket.");
      }
    }
  };
  
  const handleFileDownload = async (fileName) => {
    try {
      const response = await ticketService.downloadFile(fileName);
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (error) {
      alert("Impossible de télécharger le fichier.");
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'OUVERT': return 'danger';
      case 'EN_COURS': return 'warning';
      case 'EN_ATTENTE_CLIENT': return 'info';
      case 'CLOTURE': return 'success';
      default: return 'secondary';
    }
  };

  return (
    // On utilise un Container fluid avec un padding pour plus d'espace
    <Container className="py-4"> 
    
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="h2">Tableau de Bord des Tickets</h1>
      {user?.role === 'CLIENT' && (
        <Link to="/tickets/new">
          <Button variant="primary" className="d-flex align-items-center">
            <PlusCircleFill className="me-2" />
            Nouveau Ticket
          </Button>
        </Link>
      )}
    </div>

      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="g-3 align-items-end">
              <Col md={5}><Form.Group><Form.Label>Rechercher</Form.Label><Form.Control type="text" placeholder="Titre, description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Form.Group></Col>
              <Col md={5}><Form.Group><Form.Label>Statut</Form.Label><Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">Tous</option><option value="OUVERT">Ouvert</option><option value="EN_COURS">En Cours</option><option value="EN_ATTENTE_CLIENT">En Attente</option><option value="CLOTURE">Clôturé</option></Form.Select></Form.Group></Col>
              <Col md={2}><Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setStatusFilter(''); }} className="w-100">Effacer</Button></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0"> {/* p-0 pour que le tableau colle aux bords de la carte */}
          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger" className="m-3">{error}</Alert>
          ) : (
            <Table striped hover responsive="sm" className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">ID</th><th>Titre</th><th>Client</th><th>Statut</th><th>Date de Création</th><th>Pièce Jointe</th>
                  {user?.role === 'ADMIN' && <th className="text-end pe-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr><td colSpan={user?.role === 'ADMIN' ? 7 : 6} className="text-center p-4 text-muted">Aucun ticket trouvé.</td></tr>
                ) : (
                  tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td className="ps-3">#{ticket.id}</td>
                      <td><Link to={`/tickets/${ticket.id}`} className="fw-bold text-decoration-none">{ticket.titre}</Link></td>
                      <td>{ticket.nomClient}</td>
                      <td><Badge bg={getStatusBadgeVariant(ticket.statut)} pill>{ticket.statut.replace('_', ' ')}</Badge></td>
                      <td>{new Date(ticket.dateCreation).toLocaleDateString('fr-FR')}</td>
                      <td>{ticket.nomFichier && <Button variant="link" size="sm" onClick={() => handleFileDownload(ticket.nomFichier)} title="Voir la pièce jointe"><Paperclip /></Button>}</td>
                      {user?.role === 'ADMIN' && (
                        <td className="text-end pe-3">
                          <Button variant="outline-danger" size="sm" onClick={() => handleTicketDelete(ticket.id)} title="Supprimer le ticket">
                            <Trash />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DashboardPage;