import { useState } from "react";
import { FaBars, FaSignOutAlt, FaTasks, FaTimes } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, logoutUser } from "../services/authService";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const onLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    logoutUser();
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
          {isLoggedIn ? (
            <>
              <NavLink to="/tasks" className="app-nav-link" onClick={closeMenu}>
                Tasks
              </NavLink>
              <button type="button" className="app-nav-logout" onClick={onLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="app-nav-link" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className="app-nav-link" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
