import { useState } from 'react'; // Importer useState pour gérer l'état
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios'; // Importer Axios pour les appels API
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la redirection

function LoginPage() {
  // 1. Créer des "états" pour stocker l'email et le mot de passe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Pour gérer les messages d'erreur

  // Hook pour la navigation
  const navigate = useNavigate();

  // 2. Fonction qui sera appelée quand on soumet le formulaire
  const handleLogin = async (event) => {
    event.preventDefault(); // Empêche la page de se recharger
    setError(''); // Réinitialiser les erreurs

    try {
      // 3. Appeler notre API backend avec Axios
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password,
      });

      // 4. Si la connexion réussit, stocker le token
      const token = response.data.token;
      localStorage.setItem('authToken', token); // On stocke le token dans le localStorage du navigateur

      // 5. Rediriger l'utilisateur vers le tableau de bord
      navigate('/dashboard');

    } catch (err) {
      // Si l'API renvoie une erreur (ex: mauvais mot de passe)
      setError('Email ou mot de passe incorrect.');
      console.error('Erreur de connexion:', err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Connexion - Portail SAV</h2>

          {/* Afficher l'alerte d'erreur si elle existe */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Lier la soumission du formulaire à notre fonction handleLogin */}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Adresse Email</Form.Label>
              {/* Lier la valeur du champ à notre état "email" */}
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Mettre à jour l'état à chaque frappe
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mot de passe</Form.Label>
              {/* Lier la valeur du champ à notre état "password" */}
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Mettre à jour l'état
              />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                Se connecter
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;