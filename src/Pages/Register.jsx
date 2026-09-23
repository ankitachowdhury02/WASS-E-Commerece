import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill all the fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://ecomm-qy13.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Register API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Success message
      setMessage(
        data.message || "Account created successfully!"
      );

      // Clear form
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error("Registration Error:", error);

      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Popup OK button
  const handlePopupClose = () => {
    setMessage("");
    navigate("/login");
  };

  return (
    <section className="register-page">

      <div className="register-box">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your account to get started
        </p>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="register-field">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div className="register-field">
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Email */}
          <div className="register-field">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="register-field">
            <label>Create Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create your password"
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Error message */}
        {error && (
          <p className="register-error">
            ❌ {error}
          </p>
        )}

        {/* Login link */}
        <div className="already-account">
          <p>Already have an account?</p>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>


      {/* ================= SUCCESS POPUP ================= */}

      {message && (
        <div className="popup-overlay">

          <div className="success-popup">

            <div className="success-icon">
              ✓
            </div>

            <h2>Account Created!</h2>

            <p>
              {message}
            </p>

            <button
              className="popup-ok-button"
              onClick={handlePopupClose}
            >
              OK
            </button>

          </div>

        </div>
      )}

    </section>
  );
};

export default Register;