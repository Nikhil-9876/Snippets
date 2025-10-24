import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";

const Listing = () => {
  const firebase = useFirebase();
  const [name, setName] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!isbnNumber.trim()) {
      toast.error("ISBN number is required");
      return;
    }
    if (!price) {
      toast.error("Price is required");
      return;
    }
    if (!coverPic) {
      toast.error("Cover picture file is required");
      return;
    }

    setLoading(true);
    try {
      // Save listing data with uploaded image URL
      await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);

      // Success feedback and reset form
      toast.success("Listing created successfully!");
      setName("");
      setIsbnNumber("");
      setPrice("");
      setCoverPic(null);
    } catch (err) {
      toast.error(err.message || "Failed to create listing");
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
    </Container>
  );
};

export default Listing;
