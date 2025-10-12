import { Link } from "react-router-dom";
import "./CSS/Navbar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h3 className="brand-link">MovieQuest</h3>
      </div>
      <div className="navbar-links">
        <button style={{ backgroundColor: "white" }}>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </button>
        <button style={{ backgroundColor: "white" }}>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
