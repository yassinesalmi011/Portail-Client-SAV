import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function CreateTicketModal({ onTicketCreated }) {
  const [show, setShow] = useState(false); // État pour savoir si la modale est ouverte ou fermée
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [typeProbleme, setTypeProbleme] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setShow(false);
    setError(''); // Vider les erreurs en fermant
  }
  const handleShow = () => setShow(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique pour appeler l'API (à ajouter)
    console.log({ titre, description, typeProbleme });

    // TODO: Appeler le service pour créer le ticket
    // Si succès, appeler la fonction onTicketCreated() et fermer la modale
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        + Créer un nouveau ticket
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Créer un Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type de problème</Form.Label>
              <Form.Control
                type="text"
                value={typeProbleme}
                onChange={(e) => setTypeProbleme(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description détaillée</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Créer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateTicketModal;