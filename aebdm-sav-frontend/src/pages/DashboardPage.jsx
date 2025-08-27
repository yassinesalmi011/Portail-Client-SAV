import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
import ticketService from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true); // Remettre à true au début du fetch
      const response = await ticketService.getTickets();
      setTickets(response.data);
    } catch (err) {
      setError('Impossible de charger les tickets.');
      console.error(err);
    } finally {
      setLoading(false); // Mettre à false à la fin
    }
  }, []); // Le tableau de dépendances vide est correct

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleFileDownload = async (fileName) => {
  try {
    const response = await ticketService.downloadFile(fileName);
    
    // --- MODIFICATION IMPORTANTE ICI ---
    // On essaie de deviner le type de contenu à partir de l'en-tête de la réponse
    const contentType = response.headers['content-type'];

    // On crée le Blob en spécifiant le type de contenu
    const blob = new Blob([response.data], { type: contentType });
    const fileURL = URL.createObjectURL(blob);
    // --- FIN DE LA MODIFICATION ---

    window.open(fileURL, '_blank');
    
  } catch (error) {
    console.error("Erreur lors du téléchargement du fichier:", error);
    alert("Impossible de télécharger le fichier.");
  }
};
  const handleTicketDelete = async (ticketId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) {
      try {
        await ticketService.deleteTicket(ticketId);
        fetchTickets(); // Rafraîchir
      } catch (err) {
        alert("Erreur lors de la suppression du ticket.");
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tableau de Bord des Tickets</h1>
        {user?.role === 'CLIENT' && (
          <Link to="/tickets/new">
            <Button variant="primary">+ Créer un Ticket</Button>
          </Link>
        )}
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Titre</th><th>Client</th><th>Statut</th><th>Date de Création</th> <th>Pièce Jointe</th>
            {user?.role === 'ADMIN' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr><td colSpan={user?.role === 'ADMIN' ? 6 : 5} className="text-center">Aucun ticket à afficher.</td></tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td><Link to={`/tickets/${ticket.id}`}>{ticket.titre}</Link></td>
                <td>{ticket.nomClient}</td>
                <td>{ticket.statut}</td>
                <td>{new Date(ticket.dateCreation).toLocaleString('fr-FR')}</td>
                 <td>
         {/* On affiche le lien SEULEMENT si un nom de fichier existe */}
      {ticket.nomFichier && (
    <Button
      variant="link" // Pour qu'il ressemble à un lien
      size="sm"
      onClick={() => handleFileDownload(ticket.nomFichier)}
    >
      Voir Fichier
    </Button>
  )}
    </td>
                {user?.role === 'ADMIN' && (
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleTicketDelete(ticket.id)}>
                      Supprimer
                    </Button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardPage;