import React, { useEffect, useState } from "react";
import { Button, Form, Toast, ToastContainer, Container, Row, Col, Card } from "react-bootstrap";
import { useFirebase } from "../../context/Firebase";
import { getAuth} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const firebase = useFirebase();
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    if(firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase, navigate]);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await firebase.signInUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log("Login successful:", user);
      setError("");
      setSuccessMessage("Login successful! Welcome back.");
      setShowSuccessToast(true);
    } catch (err) {
      setError(err.message);
      setShowErrorToast(true);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await firebase.signinWithGoogle();
      const user = result.user;
      console.log("Google login successful:", user);
      setSuccessMessage("Google login successful! Welcome back.");
      setShowSuccessToast(true);
    } catch (err) {
      setError(err.message);
      setShowErrorToast(true);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Email is required");
      setShowErrorToast(true);
      return;
    }
    if (!password) {
      setError("Password is required");
      setShowErrorToast(true);
      return;
    }

    loginUser(email, password);
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg rounded" style={{ minWidth: "350px", maxWidth: "420px" }}>
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">Log In</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100 mb-3">
                  {loading ? "Logging in..." : "Log In"}
                </Button>

                <Button
                  variant="danger"
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Processing..." : "Log In with Google"}
                </Button>
              </Form>

              {/* Link to signup */}
              <div className="text-center mt-4">
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary text-decoration-none">
                    Sign up here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Toast container */}
      <ToastContainer position="top-center" className="p-3">
        {/* Success Toast */}
        <Toast
          onClose={() => setShowSuccessToast(false)}
          show={showSuccessToast}
          delay={3500}
          autohide
          bg="success"
          className="text-white shadow"
        >
          <Toast.Header closeButton={false} className="bg-success text-white border-0">
            <strong className="me-auto">Success</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-2"></i>
              {successMessage}
            </div>
          </Toast.Body>
        </Toast>

        {/* Error Toast */}
        <Toast
          onClose={() => setShowErrorToast(false)}
          show={showErrorToast}
          delay={6000}
          autohide
          bg="danger"
          className="text-white shadow"
        >
          <Toast.Header closeButton={false} className="bg-danger text-white border-0">
            <strong className="me-auto">Error</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {error}
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Login;
