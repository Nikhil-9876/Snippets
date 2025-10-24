import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

const BookDetails = () => {
  const params = useParams();
  const firebase = useFirebase();
  const [data, setData] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const doc = await firebase.getBookById(params.bookId);
        if (!doc.exists) {
          setError("Book not found");
          toast.error("Book not found");
          setLoading(false);
          return;
        }
        const bookDetails = { id: doc.id, ...doc.data() };
        setData(bookDetails);

        if (bookDetails.coverURL) {
          try {
            const url = await firebase.getImageURL(bookDetails.coverURL);
            setImageURL(url);
          } catch (e) {
            setImageURL(null);
          }
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch book details");
        toast.error("Failed to load book details");
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [params.bookId, firebase]);


  const placeOrder = async () => {
    if (!firebase.user) {
      toast.error("Please login to place an order");
      return;
    }
    
    if (quantity < 1) {
      toast.error("Please select a valid quantity");
      return;
    }

    setOrderLoading(true);
    try {
      const result = await firebase.placeOrder(params.bookId, quantity, data.price);
      toast.success(`Order placed successfully! Order ID: ${result.id}`);
      console.log("Order placed:", result);
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  }; 

  if (loading) {
    return <div className="container my-5 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container my-5 text-danger text-center">{error}</div>;
  }

  return (
    <div className="container my-4 d-flex justify-content-center">
      <Card className="shadow-lg" style={{ maxWidth: "700px" }}>
        <div className="row g-0 align-items-center">
          {/* Book Cover Image */}
          {imageURL && (
            <div className="col-md-4 p-3">
              <Card.Img
                variant="top"
                src={imageURL}
                alt={data.name}
                style={{ height: "250px", objectFit: "contain" }}
              />
            </div>
          )}
          {/* Book Info */}
          <div className="col-md-8 p-3">
            <Card.Body>
              <Card.Title className="fs-3 mb-3">{data.name}</Card.Title>
              <Card.Text><strong>Author:</strong> {data.displayName}</Card.Text>
              <Card.Text>
                <Badge bg="info" className="me-2">
                  ISBN: {data.isbn}
                </Badge>
                <Badge bg="success">₹{data.price}</Badge>
              </Card.Text>
              {data.description && (
                <div className="mt-3">
                  <h5>Description</h5>
                  <p>{data.description}</p>
                </div>
              )}
              {/* Quantity Selector */}
              <div className="mt-4 d-flex align-items-center">
                <label htmlFor="quantity" className="me-2">
                  <strong>Quantity:</strong>
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  style={{ width: "100px" }}
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              {/* Buy Button */}
              <div className="d-grid mt-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => placeOrder()}
                  disabled={orderLoading}
                >
                  {orderLoading ? "Placing Order..." : "Buy Now"}
                </button>
              </div>
            </Card.Body>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookDetails;
