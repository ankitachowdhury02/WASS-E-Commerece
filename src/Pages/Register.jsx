
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Please fill all the fields.");
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

      // Backend error
      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      // Success message
      toast.success(
        data.message || "Account created successfully!",
        {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        }
      );

      // Clear form
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
      });

      // Go to login page
      setTimeout(() => {
        navigate("/login");
      }, 2200);

    } catch (error) {
      console.error("Registration Error:", error);

      toast.error(
        error.message || "Something went wrong.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">

      <div className="register-box">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your account to get started
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="register-field">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
            />
          </div>

          {/* Phone Number */}
          <div className="register-field">
            <label htmlFor="phone">
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              autoComplete="tel"
            />
          </div>

          {/* Email */}
          <div className="register-field">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="register-field">
            <label htmlFor="password">
              Create Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create your password"
              autoComplete="new-password"
            />
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <div className="already-account">
          <p>Already have an account?</p>

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>

      {/* Toast */}
      <ToastContainer />

    </section>
  );
};

export default Register;
