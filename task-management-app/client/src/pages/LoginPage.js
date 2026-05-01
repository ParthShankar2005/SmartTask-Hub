import { useState } from "react";
import Button from "../components/Button";
import { loginUser } from "../services/authService";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      setMessage("Login successful.");
    } catch (_error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  return (
    <section className="container py-4">
      <h2 className="mb-3">Login</h2>
      <form onSubmit={onSubmit} className="card p-3 shadow-sm">
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
        <Button type="submit">Login</Button>
      </form>
      {message && <p className="mt-3 mb-0">{message}</p>}
    </section>
  );
}

export default LoginPage;
