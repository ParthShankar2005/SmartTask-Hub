import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { registerUser, setAuthToken } from "../services/authService";

const getPasswordStrength = (password) => {
  if (password.length < 6) {
    return { label: "Too short", className: "text-danger" };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const score = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
  if (score <= 1) {
    return { label: "Weak", className: "text-warning" };
  }
  if (score === 2) {
    return { label: "Medium", className: "text-primary" };
  }
  return { label: "Strong", className: "text-success" };
};

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    if (formData.password.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage("Password and confirm password do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setAuthToken(response.token, rememberMe);
      setMessage("Registration successful.");
      navigate("/tasks");
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-4">
      <h2 className="mb-3">Create Account</h2>
      <form onSubmit={onSubmit} className="card p-3 shadow-sm login-form-card">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={onChange}
            required
          />
        </div>

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
          {formData.password && (
            <small className={`d-block mt-1 ${passwordStrength.className}`}>
              Strength: {passwordStrength.label}
            </small>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="form-control"
            value={formData.confirmPassword}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            id="remember-register"
            className="form-check-input"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <label htmlFor="remember-register" className="form-check-label">
            Remember me on this device
          </label>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-3 mb-0">
        Already have an account? <Link to="/login">Login</Link>
      </p>
      {message && <p className={`mt-2 mb-0 ${isError ? "text-danger" : "text-success"}`}>{message}</p>}
    </section>
  );
}

export default RegisterPage;
