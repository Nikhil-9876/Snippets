import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/Firebase"; // Adjust path as needed
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";

function NavbarComponent() {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await firebase.signOutUser();
      toast.success("Logged out successfully");
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Bookify
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/book/list">
            Add Listing
          </Nav.Link>
          <Nav.Link as={Link} to="/orders">
            Orders
          </Nav.Link>
        </Nav>
        {/* Show Logout button only if logged in */}
        {firebase.user && (
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
