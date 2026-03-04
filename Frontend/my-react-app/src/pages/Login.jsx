// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://wholesale-qtojynuu0-munamoses-projects.vercel.app"
).replace(/\/+$/, "");

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slideText, setSlideText] = useState(
    "We save the world by making business free and easy"
  );

  // Slide text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideText((prev) =>
        prev === "We save the world by making business free and easy"
          ? "Connect and grow your wholesale business today"
          : "We save the world by making business free and easy"
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/login/`, {
        username: formData.username,
        password: formData.password,
      });

      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <h1>Wholesale System</h1>
        <p className="slide-text">{slideText}</p>
      </div>

      <div className="auth-form-side">
        <h2>Login</h2>
        <p>Access your account and manage your orders!</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="toggle-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
        .auth-side {
          flex: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
        }
        .auth-side h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .slide-text {
          font-size: 1.25rem;
          font-weight: 500;
          margin-top: 1rem;
        }
        .auth-form-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: white;
          padding: 3rem 2rem;
        }
        .auth-form-side h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .auth-form-side p {
          color: #6b7280;
          margin-bottom: 2rem;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 350px;
        }
        .auth-form input {
          padding: 0.85rem 1rem;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .auth-form input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        .btn-submit {
          background: #4f46e5;
          color: white;
          font-weight: 600;
          padding: 0.85rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .btn-submit:hover:not(:disabled) {
          background: #4338ca;
        }
        .btn-submit:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        .toggle-link {
          margin-top: 1.5rem;
          font-size: 0.95rem;
        }
        .toggle-link a {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: none;
        }
        .toggle-link a:hover {
          text-decoration: underline;
        }
        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.85rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        @media (max-width: 900px) {
          .auth-page {
            flex-direction: column;
          }
          .auth-side,
          .auth-form-side {
            width: 100%;
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
