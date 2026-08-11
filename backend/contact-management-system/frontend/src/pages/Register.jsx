import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      await register(form);

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-brand">
          <div className="brand-icon">C</div>
          <h1>ContactHub</h1>
        </div>

        <div className="auth-heading">
          <h2>Create your account</h2>
          <p>Start managing your contacts today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label>Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="03001234567"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}