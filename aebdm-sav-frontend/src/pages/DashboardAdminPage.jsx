import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import dashboardService from '../services/dashboardService';

// Enregistrement des modules de Chart.js dont nous avons besoin.
// C'est une étape obligatoire pour que les graphiques s'affichent.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DashboardAdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data);
      } catch (err) {
        setError("Impossible de charger les statistiques. Assurez-vous d'être connecté en tant qu'administrateur.");
        console.error("Erreur de chargement des stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois au montage.

  // Affichage conditionnel pendant le chargement ou en cas d'erreur
  if (loading) return <Container className="text-center mt-5"><Spinner animation="border" style={{ width: '3rem', height: '3rem' }} /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  if (!stats) return <Container className="mt-4"><Alert variant="warning">Aucune statistique disponible pour le moment.</Alert></Container>;

  // --- Préparation des données pour les graphiques ---

  // Données pour le graphique en camembert (Pie) : Répartition par type de problème
  const ticketsParTypeData = {
    labels: Object.keys(stats.ticketsParType),
    datasets: [{
      label: 'Nombre de Tickets',
      data: Object.values(stats.ticketsParType),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  // Données pour le graphique en barres (Bar) : Tickets résolus par technicien
  const ticketsParTechnicienData = {
    labels: Object.keys(stats.ticketsResolusParTechnicien),
    datasets: [{
      label: 'Tickets Résolus',
      data: Object.values(stats.ticketsResolusParTechnicien),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };
  
  // Options pour le graphique en barres, pour s'assurer que l'axe Y commence à 0
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1 // Forcer les graduations à être des entiers (1, 2, 3...)
        }
      }
    },
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Performance des Techniciens' },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Répartition des Tickets par Type' },
    },
  };

  return (
    <Container fluid className="p-4">
      <h1 className="mb-4">Tableau de Bord Administrateur</h1>

      {/* Cartes pour les chiffres clés */}
      <Row className="mb-4">
        <Col xl={3} md={6} className="mb-3"><Card bg="danger" text="white" className="h-100"><Card.Body className="text-center"><Card.Title className="display-4">{stats.totalTicketsOuverts}</Card.Title><Card.Text>Tickets Ouverts</Card.Text></Card.Body></Card></Col>
        <Col xl={3} md={6} className="mb-3"><Card bg="warning" text="dark" className="h-100"><Card.Body className="text-center"><Card.Title className="display-4">{stats.totalTicketsEnCours}</Card.Title><Card.Text>Tickets en Cours</Card.Text></Card.Body></Card></Col>
        <Col xl={3} md={6} className="mb-3"><Card bg="success" text="white" className="h-100"><Card.Body className="text-center"><Card.Title className="display-4">{stats.totalTicketsClotures}</Card.Title><Card.Text>Tickets Clôturés</Card.Text></Card.Body></Card></Col>
        <Col xl={3} md={6} className="mb-3"><Card bg="primary" text="white" className="h-100"><Card.Body className="text-center"><Card.Title className="display-4">{stats.totalTicketsOuverts + stats.totalTicketsEnCours + stats.totalTicketsClotures}</Card.Title><Card.Text>Total des Tickets</Card.Text></Card.Body></Card></Col>
      </Row>

      {/* Graphiques */}
      <Row>
        <Col xl={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Pie options={pieOptions} data={ticketsParTypeData} />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Bar options={barOptions} data={ticketsParTechnicienData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardAdminPage;