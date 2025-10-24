import React, { useState } from "react";
import { Button, Form, Toast, ToastContainer, Container, Row, Col, Card } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";

const Listing = () => {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setError("Name is required");
      setShowErrorToast(true);
      return;
    }
    if (!isbnNumber.trim()) {
      setError("ISBN number is required");
      setShowErrorToast(true);
      return;
    }
    if (!price) {
      setError("Price is required");
      setShowErrorToast(true);
      return;
    }
    if (!coverPic) {
      setError("Cover picture file is required");
      setShowErrorToast(true);
      return;
    }

    setLoading(true);
    try {
      
      // Save listing data with uploaded image URL
      await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);

      // Success feedback and reset form
      setSuccessMessage("Listing created successfully!");
      setShowSuccessToast(true);
      setName("");
      setIsbnNumber("");
      setPrice("");
      setCoverPic(null);
    } catch (err) {
      setError(err.message || "Failed to create listing");
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <Row>
        <Col>
          <Card className="p-4 shadow-lg rounded" style={{ minWidth: "350px", maxWidth: "420px" }}>
            <Card.Body>
              <h2 className="text-center mb-4 text-primary">Create Listing</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIsbnNumber">
                  <Form.Label>ISBN Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ISBN number"
                    value={isbnNumber}
                    onChange={(e) => setIsbnNumber(e.target.value)}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={loading}
                    required
                    min="0"
                    step="0.01"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formCoverPic">
                  <Form.Label>Cover Picture</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverPic(e.target.files[0])}
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100 mb-3">
                  {loading ? "Submitting..." : "Create Listing"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-center" className="p-3">
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

export default Listing;
