import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/Firebase';
import BookCard from '../components/bookCard'; // Adjust the import path as needed

const Home = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await firebase.listAllBooks();
        setBooks(books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [firebase]);

  return (
    <div className="container my-4">
      <h1 className="mb-4">Books Listing</h1>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <div className="row">
          {books.map((book) => (
            <BookCard key={book.id} book={book} getImageURL={firebase.getImageURL} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
