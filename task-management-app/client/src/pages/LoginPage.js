import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { isAuthenticated, loginUser, setAuthToken } from "../services/authService";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectPath = location.state?.from || "/tasks";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(location.state?.message || "");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath]);

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email: formData.email.trim(), password: formData.password });
      setAuthToken(response.token, rememberMe);
      setMessage("Login successful.");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Authentication failed. Check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-4">
      <h2 className="mb-3">Login</h2>
      <form onSubmit={onSubmit} className="card p-3 shadow-sm login-form-card">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            value={formData.password}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            id="remember-login"
            className="form-check-input"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <label htmlFor="remember-login" className="form-check-label">
            Remember me
          </label>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Login"}
        </Button>
      </form>
      <p className="mt-3 mb-0">
        New user? <Link to="/register">Create an account</Link>
      </p>
      {message && <p className={`mt-3 mb-0 ${isError ? "text-danger" : "text-success"}`}>{message}</p>}
    </section>
  );
}

export default LoginPage;
