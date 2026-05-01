import { useState } from "react";
import { FaBars, FaSignOutAlt, FaTasks, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="app-nav">
      <div className="container app-nav-inner">
        <NavLink to="/" className="app-nav-brand" onClick={closeMenu}>
          <FaTasks className="brand-icon" />
          <span>Task Manager</span>
        </NavLink>

        <button
          type="button"
          className="app-nav-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`app-nav-links ${isMenuOpen ? "is-open" : ""}`}>
          <NavLink to="/" className="app-nav-link" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/tasks" className="app-nav-link" onClick={closeMenu}>
            Tasks
          </NavLink>
          <NavLink to="/login" className="app-nav-link" onClick={closeMenu}>
            Login
          </NavLink>
          <button type="button" className="app-nav-logout" onClick={onLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
