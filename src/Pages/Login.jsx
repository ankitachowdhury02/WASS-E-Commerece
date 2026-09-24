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


  // Input change
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // Login submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Previous message clear
    setError("");
    setMessage("");


    // Empty field check
    if (!formData.login || !formData.password) {

      setError("Please enter your Email/Phone and Password.");

      return;
    }


    try {

      setLoading(true);


      /*
        LOGIN API

        IMPORTANT:
        এখানে তোমার actual login API URL বসাতে হবে।
      */

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


      // API response
      const data = await response.json();

      console.log("Login API Response:", data);


      // API error
      if (!response.ok) {

        throw new Error(
          data.message || "Login failed."
        );
      }


      // Success
      setMessage(
        data.message || "Login successful!"
      );


      /*
        যদি API থেকে token আসে,
        পরে আমরা এখানে token save করব।
      */

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );
      }


      // Login successful হলে Home page
      setTimeout(() => {

        navigate("/");

      }, 1500);


    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setError(
        error.message || "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <section className="login-page">

      <div className="login-box">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Please login to your Account
        </p>


        {/* Login Form */}
        <form onSubmit={handleSubmit}>


          {/* Email / Phone */}
          <div className="login-field">

            <label>
              Email Address / Phone No.
            </label>

            <input
              type="email"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your Email / Phone"
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


        {/* Create Account */}
        <div className="create-account">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>


        {/* Admin Login */}
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