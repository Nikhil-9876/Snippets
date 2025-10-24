import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

// css
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// components
import NavbarComponent from './components/navbar'; // Adjust path as needed

// pages
import Signup from './pages/authentication/signup';
import Login from './pages/authentication/login';
import About from './pages/about';
import Home from './pages/home';
import Listing from './pages/listing';

function App() {
  const location = useLocation();
  const [count, setCount] = useState(0);

  // Show navbar except on login and signup pages
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <>
      {showNavbar && <NavbarComponent />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book/list" element={<Listing />} />
      </Routes>
    </>
  );
}

export default App;
