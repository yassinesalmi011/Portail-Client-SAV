import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('authToken', response.data.token);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
      setLoading(false);
    }
  };

  return (
    // 1. Conteneur principal avec l'image de fond
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(/public/login.png)`, // <-- CHEMIN VERS VOTRE IMAGE
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 2. Superposition (overlay) pour la lisibilité */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.45)', // <-- Overlay gris semi-transparent, vous pouvez ajuster la valeur
        }}
      >
        {/* 3. Votre formulaire (inchangé à l'intérieur) */}
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0 rounded-3">
            <Card.Body className="p-4 p-sm-5">
              <div className="text-center mb-4">
                <img src="/logo.png" alt="Logo AEBDM" width="72" height="72" className="mb-3" />
                <h2 className="fw-bold">Portail Client SAV</h2>
                <p className="text-muted">Veuillez vous connecter pour continuer</p>
              </div>

              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Adresse Email</Form.Label>
                  <Form.Control type="email" size="lg" placeholder="nom@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control type="password" size="lg" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <div className="d-grid mt-4">
                  <Button variant="primary" type="submit" size="lg" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Se connecter'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </div>
  );
}

export default LoginPage;