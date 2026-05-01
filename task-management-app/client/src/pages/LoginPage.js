import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { loginUser, registerUser } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await loginUser({ email: formData.email, password: formData.password })
          : await registerUser(formData);
      localStorage.setItem("token", response.token);
      setMessage(mode === "login" ? "Login successful." : "Account created and logged in.");
      navigate("/tasks");
    } catch (error) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Authentication failed. Check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-4">
      <h2 className="mb-3">{mode === "login" ? "Login" : "Create Account"}</h2>
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className={`btn ${mode === "login" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`btn ${mode === "register" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>
      <form onSubmit={onSubmit} className="card p-3 shadow-sm login-form-card">
        {mode === "register" && (
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
        )}
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
        <Button type="submit">{isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}</Button>
      </form>
      {message && <p className={`mt-3 mb-0 ${isError ? "text-danger" : "text-success"}`}>{message}</p>}
    </section>
  );
}

export default LoginPage;
