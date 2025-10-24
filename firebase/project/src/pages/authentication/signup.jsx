import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useFirebase } from "../../context/Firebase";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";



const Signup = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/");
    }
  }, [firebase.isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await firebase.signUpUserWithEmailAndPassword(email, password);
      setEmail("");
      setPassword("");
      toast.success("Account created successfully! Please login to continue.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    setLoading(true);

    try {
      await firebase.signinWithGoogle();
      toast.success("Google signup successful! Welcome!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.message);
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
              <h2 className="text-center mb-4 text-primary">Create an Account</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
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

              <div className="text-center mt-4">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary text-decoration-none">
                    Login here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
