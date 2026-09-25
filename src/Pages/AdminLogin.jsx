import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import "./AdminLogin.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter admin email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      console.log("ADMIN LOGIN STATUS:", response.status);
      console.log("ADMIN LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Admin login failed."
        );
      }

      const accessToken =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      const refreshToken =
        data.refreshToken ||
        data.data?.refreshToken;

      if (!accessToken) {
        throw new Error(
          "Login successful, but authentication token was not received."
        );
      }

      // Save admin session separately
      localStorage.setItem("adminToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }

      localStorage.setItem("adminLoggedIn", "true");

      // Go to temporary admin page
      navigate("/admin");
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">

      <div className="admin-login-box">

        <div className="admin-icon">
          <ShieldCheck size={42} />
        </div>

        <p className="admin-small-title">
          ADMINISTRATION
        </p>

        <h1>Admin Login</h1>

        <p className="admin-subtitle">
          Login to access the administration portal
        </p>

        <form onSubmit={handleSubmit}>

          <div className="admin-field">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="admin-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Checking..."
              : "Login to Admin Portal"}
          </button>

        </form>

        <Link to="/login" className="back-login">
          <ArrowLeft size={16} />
          Back to User Login
        </Link>

      </div>

    </section>
  );
};

export default AdminLogin;