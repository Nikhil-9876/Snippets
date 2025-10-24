import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { doc, deleteDoc } from "firebase/firestore";

const OrderDetails = () => {
  const params = useParams();
  const firebase = useFirebase();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [firebase, params.bookId]);

  const loadOrders = async () => {
    try {
      const snapshot = await firebase.getOrders(params.bookId);
      setOrders(snapshot.docs);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      setLoading(true);
      await firebase.cancelOrder(params.bookId, orderId); // Using context function
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel order:", err);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Orders</h1>

      {orders.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {orders.map((order) => {
            const data = order.data();

            return (
              <Col key={order.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      {data.photoURL ? (
                        <Image
                          src={data.photoURL}
                          alt={data.displayName || "user"}
                          roundedCircle
                          width={60}
                          height={60}
                          className="me-3"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded-circle me-3"
                          style={{ width: 60, height: 60 }}
                        />
                      )}
                      <div>
                        <Card.Title className="mb-0">
                          {data.displayName || "Anonymous"}
                        </Card.Title>
                        <Card.Subtitle className="text-muted">
                          {data.userEmail}
                        </Card.Subtitle>
                      </div>
                    </div>
                    <Card.Text>
                      <strong>Order ID:</strong> {order.id}
                    </Card.Text>
                    <Card.Text>
                      <strong>Quantity:</strong> {data.quantity}
                    </Card.Text>
                    <Card.Text>
                      <strong>Price:</strong> ₹{data.price}
                    </Card.Text>
                    <Card.Text>
                      <strong>Total Amount:</strong> ₹
                      {(data.price * data.quantity).toFixed(2)}
                    </Card.Text>
                    <Card.Text>
                      <strong>Order Date:</strong>{" "}
                      {data.orderDate?.toDate().toLocaleString() || "N/A"}
                    </Card.Text>

                    <Button
                      variant="danger"
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={loading}
                    >
                      {loading ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <p>No orders found.</p>
      )}
    </Container>
  );
};

export default OrderDetails;
