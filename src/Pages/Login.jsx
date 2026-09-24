import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

  // Login form data
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  // Error message
  const [error, setError] = useState("");

  // Success message
  const [message, setMessage] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Navigation
  const navigate = useNavigate();


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // =========================
  // LOGIN SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Clear previous messages
    setError("");
    setMessage("");


    // Check empty fields
    if (!formData.login || !formData.password) {

      setError(
        "Please enter your Email and Password."
      );

      return;
    }


    try {

      setLoading(true);


      // =========================
      // LOGIN API
      // =========================

      const response = await fetch(
        "https://ecomm-qy13.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.login,
            password: formData.password,
          }),
        }
      );


      // Convert response to JSON
      const data = await response.json();


      // Check response in Console
      console.log(
        "LOGIN API RESPONSE:",
        data
      );


      // =========================
      // API ERROR
      // =========================

      if (!response.ok) {

        throw new Error(
          data.message || "Login failed."
        );
      }


      // =========================
      // GET TOKEN
      // =========================

      /*
        Different backend APIs may
        return token in different places.

        We check all common formats.
      */

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;


      console.log(
        "TOKEN FROM API:",
        token
      );


      // =========================
      // TOKEN NOT FOUND
      // =========================

      if (!token) {

        setError(
          "Login successful, but authentication token was not received."
        );

        console.log(
          "No token found in login response."
        );

        return;
      }


      // =========================
      // SAVE TOKEN
      // =========================

      localStorage.setItem(
        "token",
        token
      );


      // Check saved token
      console.log(
        "TOKEN SAVED:",
        localStorage.getItem("token")
      );


      // =========================
      // SUCCESS MESSAGE
      // =========================

      setMessage(
        data.message || "Login successful!"
      );


      // =========================
      // GO TO HOME
      // =========================

      setTimeout(() => {

        navigate("/");

      }, 1000);


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <section className="login-page">

      <div className="login-box">

        <h1>
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Please login to your Account
        </p>


        {/* =========================
            LOGIN FORM
        ========================= */}

        <form onSubmit={handleSubmit}>


          {/* Email */}

          <div className="login-field">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your Email"
            />

          </div>


          {/* Password */}

          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
            />

          </div>


          {/* Remember + Forgot */}

          <div className="login-options">

            <label>

              <input
                type="checkbox"
              />

              Remember me

            </label>


            <a href="#">
              Forgot Password?
            </a>

          </div>


          {/* Error */}

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}


          {/* Success */}

          {message && (
            <p className="login-success">
              {message}
            </p>
          )}


          {/* Login Button */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* =========================
            CREATE ACCOUNT
        ========================= */}

        <div className="create-account">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>


        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <div className="admin-section">

          <p className="admin-title">
            Admin / Staff Access
          </p>

          <Link
            to="/admin-login"
            className="admin-button"
          >
            Admin Login
          </Link>

        </div>

      </div>

    </section>
  );
};

export default Login;