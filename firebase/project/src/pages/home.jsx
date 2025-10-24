import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "../components/bookCard"; // your existing import
import { useFirebase } from "../context/Firebase";
import { toast } from "react-toastify";

const Home = () => {
  const firebase = useFirebase();
  const location = useLocation();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await firebase.listAllBooks();
        setBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books. Please try again.");
      }
    };
    fetchBooks();
  }, [firebase]);

  // Show toast if passed in location.state
  useEffect(() => {
    if (location.state?.toastMessage) {
      if (location.state.toastVariant === "success") {
        toast.success(location.state.toastMessage);
      } else {
        toast.error(location.state.toastMessage);
      }
      // Clear state so it doesn't show again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="container my-4">
      <h1 className="mb-4">Books Listing</h1>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="row">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              link={`/book/view/${book.id}`}
              getImageURL={firebase.getImageURL}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
