import React, { useEffect, useState } from 'react'
import { useFirebase } from '../context/Firebase';
import { toast } from 'react-toastify';
import BookCard from '../components/bookCard';

const orders = () => {
    const firebase = useFirebase();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (firebase.isLoggedIn) {
                try {
                    setLoading(true);
                    const books = await firebase.fetchMyBooks(firebase.user.uid);
                    setBooks(books.docs);
                } catch (error) {
                    toast.error("Failed to load your orders");
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [firebase]);

    if (!firebase.isLoggedIn) {
        return <p>Please log in to view your orders.</p>;
    }   

    if (loading) {
        return <div className="container my-5 text-center">Loading your orders...</div>;
    }

    return (
        <div className="container my-4">
            <h1 className="mb-4">Your Orders</h1>
            {
                books.length > 0 ? (
                    <div className="row">
                        {books.map((book) => (
                            <BookCard 
                                link={`/book/orders/${book.id}`} 
                                key={book.id} 
                                book={{id: book.id, ...book.data()}} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-muted">No orders found.</p>
                    </div>
                )
            }
        </div>
    )
}

export default orders
