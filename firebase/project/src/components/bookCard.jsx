import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { useFirebase } from "../context/Firebase";

const BookCard = (props) => {
  const firebase = useFirebase();
  const [url, setURL] = useState(null);

  useEffect(() => {
    const fetchURL = async () => {
      try {
        const downloadURL = await firebase.getImageURL(props.book.coverURL);
        setURL(downloadURL);
      } catch (error) {
        console.error("Failed to get image URL", error);
        setURL(null);
      }
    };
    fetchURL();
  }, [props.book.coverURL, firebase]);

  return (
    <div className="col-md-4 mb-4 d-flex justify-content-center">
      <Card
        className="h-100 shadow-sm"
        style={{ maxWidth: "240px", width: "100%" }}
      >
        <Card.Img
          variant="top"
          src={url || ""}
          alt={props.book.name}
          style={{ height: "180px", objectFit: "contain" }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fs-5">{props.book.name}</Card.Title>
          <Card.Text className="mb-1">
            <strong>Author/User: </strong> {props.book.displayName}
          </Card.Text>
          <Card.Text className="mb-1">
            <Badge bg="info" className="me-2">
              ISBN: {props.book.isbn}
            </Badge>
            <Badge bg="success">₹{props.book.price}</Badge>
          </Card.Text>
          <Button variant="primary" className="mt-auto">
            View Details
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookCard;
