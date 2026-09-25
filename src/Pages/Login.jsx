import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // LOGIN SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // VALIDATION

    if (!formData.login || !formData.password) {
      setError("Please enter your Email and Password.");
      return;
    }

    try {
      setLoading(true);

      // LOGIN API

      const response = await fetch(
        "https://ecomm-qy13.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.login.trim(),
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      console.log("LOGIN API STATUS:", response.status);

      console.log("LOGIN API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // GET ACCESS TOKEN

      const accessToken =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      // GET REFRESH TOKEN

      const refreshToken = data.refreshToken || data.data?.refreshToken;

      // CHECK ACCESS TOKEN

      if (!accessToken) {
        console.error("Login response did not contain an access token.");

        setError(
          "Login successful, but authentication token was not received.",
        );

        return;
      }

      // CLEAR OLD TOKENS

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      localStorage.setItem("token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      console.log("Access token saved:", !!localStorage.getItem("token"));

      console.log(
        "Refresh token saved:",
        !!localStorage.getItem("refreshToken"),
      );

      setMessage(data.message || "Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-box">
        <h1>Welcome Back</h1>

        <p className="login-subtitle">Please login to your Account</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email Address</label>

            <input
              type="email"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your Email"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#">Forgot Password?</a>
          </div>

          {error && <p className="login-error">{error}</p>}

          {message && <p className="login-success">{message}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* CREATE ACCOUNT*/}

        <div className="create-account">
          <p>Don't have an account?</p>

          <Link to="/register">Create Account</Link>
        </div>

        {/* ADMIN LOGIN*/}

        <div className="admin-section">
          <p className="admin-title">Admin / Staff Access</p>

          <Link to="/admin-login" className="admin-button">
            Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
