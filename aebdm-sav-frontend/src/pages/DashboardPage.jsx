import { useState, useEffect } from 'react';
import ticketService from '../services/ticketService'; // Importer notre service
// En haut du fichier DashboardPage.jsx
import { Link } from 'react-router-dom';
import { Container, Table, Alert, Spinner, Button } from 'react-bootstrap';
function DashboardPage() {
  // 1. Créer des états pour stocker les tickets, le chargement et les erreurs
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true); // On commence en mode chargement
  const [error, setError] = useState('');

  // 2. useEffect est un hook qui s'exécute après le premier affichage du composant
  useEffect(() => {
    // Fonction pour charger les tickets
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getTickets();
        setTickets(response.data); // Mettre à jour l'état avec les tickets reçus
      } catch (err) {
        setError('Impossible de charger les tickets. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false); // Arrêter le chargement, que ça ait réussi ou non
      }
    };

    fetchTickets();
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une seule fois

  // 3. Gérer l'affichage conditionnel
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Container><Alert variant="danger">{error}</Alert></Container>;
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Tableau de Bord des Tickets</h1>
<Link to="/tickets/new">
      <Button variant="primary">+ Créer un Ticket</Button>
    </Link>
      {/* Afficher la table des tickets */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Client</th>
            <th>Statut</th>
            <th>Date de Création</th>
          </tr>
        </thead>
        <tbody>
          {/* Si il n'y a pas de tickets, afficher un message */}
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Aucun ticket à afficher.</td>
            </tr>
          ) : (
            // Sinon, faire une boucle sur les tickets et afficher une ligne pour chacun
            
tickets.map(ticket => (
  <tr key={ticket.id}>
    <td>{ticket.id}</td>
    {/* On transforme le titre en lien */}
    <td>
      <Link to={`/tickets/${ticket.id}`}>{ticket.titre}</Link>
    </td>
    <td>{ticket.nomClient}</td>
    <td>{ticket.statut}</td>
    <td>{new Date(ticket.dateCreation).toLocaleString('fr-FR')}</td>
  </tr>
))
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default DashboardPage;