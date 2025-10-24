import { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useFirebase } from "./context/Firebase"; // import your Firebase context hook

// css
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// components
import NavbarComponent from "./components/navbar";

// pages
import Signup from "./pages/authentication/signup";
import Login from "./pages/authentication/login";
import About from "./pages/about";
import Home from "./pages/home";
import Listing from "./pages/listing";
import BookDetails from "./pages/bookDetails";
import Order from "./pages/orders";
import OrderDetails from "./pages/orderDetails";

// Protected Route component
const ProtectedRoute = ({ isLoggedIn, redirectPath = "/login", children }) => {
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

// Public Route component to restrict access if already logged in (like Login/Signup)
const PublicRoute = ({ isLoggedIn, redirectPath = "/", children }) => {
  if (isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const { user, authLoading } = useFirebase(); // get user and loading state from context
  const isLoggedIn = !!user;

  // Show navbar except on login and signup pages
  const showNavbar =
    location.pathname !== "/login" && location.pathname !== "/signup";

  if (authLoading) {
    // Optionally show a loading indicator while auth state resolves
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <>
      {showNavbar && <NavbarComponent />}
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        {/* Public routes only available if NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected routes - only accessible if logged in */}
        <Route
          path="/book/list"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Listing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/view/:bookId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Order />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/orders/:bookId"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
