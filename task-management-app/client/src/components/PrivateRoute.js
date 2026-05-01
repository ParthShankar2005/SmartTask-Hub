import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function PrivateRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Please login to continue.", from: location.pathname }}
      />
    );
  }

  return children;
}

export default PrivateRoute;
