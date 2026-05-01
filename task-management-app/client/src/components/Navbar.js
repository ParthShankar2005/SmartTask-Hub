import { FaTasks } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-3 py-3">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2 fw-semibold">
          <FaTasks />
          <span>Task Management App</span>
        </NavLink>
        <div className="navbar-nav ms-auto d-flex flex-row gap-3">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/tasks" className="nav-link">
            Tasks
          </NavLink>
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
