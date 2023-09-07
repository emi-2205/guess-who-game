import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        setErrorMessage(err.error); setShow(true);
      });
  };

  return (
    <Row className="justify-content-center px-4 py-1">
      <Col>
        <h1 className="pb-3">Login</h1>

        <Form onSubmit={handleSubmit}>
          <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>email</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setUsername(ev.target.value)}
              required={true}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter the password."
              onChange={(ev) => setPassword(ev.target.value)}
              required={true} minLength={6}
            />
          </Form.Group>
          <Button className="mt-3 guess-button" type="submit">Login</Button>
        </Form>
      </Col>
    </Row>

  )
};

function LogoutButton(props) {
  return (
    <>
      <Button variant="btn btn-otuline-dark" onClick={props.logout}>Logout</Button>
    </>
  )
}

function LoginButton(props) {
  const navigate = useNavigate();
  return (
    <Button variant="btn btn-otuline-dark" onClick={() => navigate('/login')}>Login</Button>
  )
}

export { LoginForm, LogoutButton, LoginButton };
