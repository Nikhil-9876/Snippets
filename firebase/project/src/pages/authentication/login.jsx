import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useFirebase } from "../../context/Firebase";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Trigger toast from route state if exists, then clear
  useEffect(() => {
    if (location.state?.toastMessage) {
      if (location.state.toastVariant === "success") {
        toast.success(location.state.toastMessage);
      } else {
        toast.error(location.state.toastMessage);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const loginUser = async () => {
    setLoading(true);
    try {
      await firebase.signInUserWithEmailAndPassword(email, password);
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await firebase.signinWithGoogle();
      toast.success("Google login successful! Welcome back.");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    loginUser();
  };

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center bg-light px-3">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <div className="p-4 shadow rounded bg-white">
            <h2 className="text-center mb-4 text-primary">Log In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </Form.Group>
              <Button type="submit" className="w-100 mb-3" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
              <Button
                variant="danger"
                className="w-100"
                disabled={loading}
                onClick={signInWithGoogle}
              >
                {loading ? "Processing..." : "Log In with Google"}
              </Button>
            </Form>
            <div className="mt-4 text-center">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
