import React, { useState,useEffect } from "react";
import {
  Button,
  Form,
  Toast,
  ToastContainer,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useFirebase } from "../../context/Firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const firebase = useFirebase();
  const auth = getAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  useEffect(() => {
    console.log(firebase.isLoggedIn);
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await firebase.signUpUserWithEmailAndPassword(email, password);
      setSuccess(true);
      setShowToast(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await firebase.signinWithGoogle();
      setSuccess(true);
      setShowToast(true);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <Row>
        <Col>
          <Card
            className="p-4 shadow-lg rounded"
            style={{ minWidth: "350px", maxWidth: "420px" }}
          >
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">
                Create an Account
              </h2>
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

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100 mb-3"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>

                <Button
                  variant="danger"
                  onClick={signUpWithGoogle}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? "Processing..." : "Sign Up with Google"}
                </Button>
              </Form>

              {/* Link to login */}
              <div className="text-center mt-4">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary text-decoration-none"
                  >
                    Login here
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
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3500}
          autohide
          bg="success"
          className="text-white shadow"
        >
          <Toast.Header
            closeButton={false}
            className="bg-success text-white border-0"
          >
            <strong className="me-auto">Success</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-2"></i>
              Account created successfully!
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
          <Toast.Header
            closeButton={false}
            className="bg-danger text-white border-0"
          >
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

export default Signup;
