import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  Phone,
  Heart,
  ShoppingCart,
  LogOut,
  Edit3,
  ShieldCheck,
  Package,
} from "lucide-react";

import "./Profile.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // REFRESH ACCESS TOKEN

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    console.log("Refresh token available:", !!refreshToken);

    // Refresh token না থাকলে
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      const data = await response.json();

      console.log("REFRESH API STATUS:", response.status);

      console.log("REFRESH API RESPONSE:", data);

      // Refresh failed
      if (!response.ok) {
        throw new Error(data.message || "Unable to refresh session.");
      }

      // GET NEW ACCESS TOKEN

      const newAccessToken =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("New access token was not received.");
      }

      // SAVE NEW ACCESS TOKEN

      localStorage.setItem("token", newAccessToken);

      console.log("New access token saved.");

      return newAccessToken;
    } catch (refreshError) {
      console.error("REFRESH TOKEN ERROR:", refreshError);

      // Refresh token invalid/expired
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      // GET ACCESS TOKEN

      let token = localStorage.getItem("token");

      console.log("Access token available:", !!token);

      if (!token) {
        console.log("No access token found.");

        setError("You are not logged in.");

        setLoading(false);

        return;
      }

      try {
        let response = await fetch(`${API_URL}/api/users/profile`, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        });

        let data = await response.json();

        console.log("PROFILE API STATUS:", response.status);

        console.log("PROFILE API RESPONSE:", data);

        // ACCESS TOKEN EXPIRED

        if (response.status === 401) {
          console.log("Access token expired. Trying refresh token...");

          // REFRESH TOKEN

          const newToken = await refreshAccessToken();

          if (!newToken) {
            throw new Error("Your session has expired. Please login again.");
          }

          // PROFILE REQUEST WITH NEW TOKEN

          response = await fetch(`${API_URL}/api/users/profile`, {
            method: "GET",

            headers: {
              Authorization: `Bearer ${newToken}`,

              "Content-Type": "application/json",
            },
          });

          data = await response.json();

          console.log("PROFILE API AFTER REFRESH STATUS:", response.status);

          console.log("PROFILE API AFTER REFRESH:", data);
        }

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        const userData = data.user || data.data?.user || data.data || data;

        console.log("FINAL USER DATA:", userData);

        // SAVE USER DATA

        setUser(userData);
      } catch (err) {
        console.error("PROFILE ERROR:", err);

        setError(err.message || "Unable to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // LOGOUT

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      // LOGOUT API

      if (token) {
        const response = await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        console.log("LOGOUT API STATUS:", response.status);

        console.log("LOGOUT API RESPONSE:", data);
      }
    } catch (logoutError) {
      console.error("LOGOUT ERROR:", logoutError);
    } finally {
      localStorage.removeItem("token");

      localStorage.removeItem("refreshToken");

      setUser(null);

      navigate("/login");
    }
  };

  if (loading) {
    return (
      <section className="profile-loading">
        <div className="profile-loader"></div>

        <p>Loading your account...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="profile-error">
        <div className="profile-error-box">
          <h2>Unable to load account</h2>

          <p>{error}</p>

          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-cover">
        <div className="profile-cover-content">
          {/* Avatar */}

          <div className="profile-avatar">
            <UserRound size={45} />
          </div>

          {/* User Heading */}

          <div className="profile-heading">
            <p>MY ACCOUNT</p>

            <h1>{user?.name || user?.fullName || "User"}</h1>

            <span>{user?.email || "Email not available"}</span>
          </div>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-main">
          <div className="profile-card">
            <div className="profile-card-heading">
              <div>
                <p className="small-title">ACCOUNT INFORMATION</p>

                <h2>Personal Details</h2>
              </div>

              <button className="edit-button" type="button">
                <Edit3 size={16} />
                Edit
              </button>
            </div>

            {/* DETAILS */}

            <div className="profile-details">
              {/* NAME */}

              <div className="detail-item">
                <div className="detail-icon">
                  <UserRound size={19} />
                </div>

                <div>
                  <span>Full Name</span>

                  <strong>
                    {user?.name || user?.fullName || "Not available"}
                  </strong>
                </div>
              </div>

              {/* EMAIL */}

              <div className="detail-item">
                <div className="detail-icon">
                  <Mail size={19} />
                </div>

                <div>
                  <span>Email Address</span>

                  <strong>{user?.email || "Not available"}</strong>
                </div>
              </div>

              {/* PHONE */}

              <div className="detail-item">
                <div className="detail-icon">
                  <Phone size={19} />
                </div>

                <div>
                  <span>Phone Number</span>

                  <strong>
                    {user?.phone ? `+91 ${user.phone}` : "Not available"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACCESS*/}

          <div className="profile-card">
            <div className="profile-card-heading">
              <div>
                <p className="small-title">QUICK ACCESS</p>

                <h2>My Account</h2>
              </div>
            </div>

            <div className="account-grid">
              {/* CART */}

              <Link to="/cart" className="account-option">
                <div className="option-icon">
                  <ShoppingCart size={22} />
                </div>

                <div>
                  <h3>My Cart</h3>

                  <p>View your selected products</p>
                </div>
              </Link>

              {/* ORDERS */}

              <div className="account-option">
                <div className="option-icon">
                  <Package size={22} />
                </div>

                <div>
                  <h3>My Orders</h3>

                  <p>Track your recent orders</p>
                </div>
              </div>

              {/* WISHLIST */}

              <div className="account-option">
                <div className="option-icon">
                  <Heart size={22} />
                </div>

                <div>
                  <h3>Wishlist</h3>

                  <p>View your favourite products</p>
                </div>
              </div>

              {/* SECURITY */}

              <div className="account-option">
                <div className="option-icon">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <h3>Security</h3>

                  <p>Manage account security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="profile-sidebar">
          {/* ACCOUNT STATUS */}

          <div className="account-status">
            <div className="status-icon">
              <ShieldCheck size={24} />
            </div>

            <p>ACCOUNT STATUS</p>

            <h3>Active Account</h3>

            <span>Your account is active and secure.</span>
          </div>

          {/* SHOPPING */}

          <div className="profile-side-card">
            <p className="small-title">SHOPPING</p>

            <h3>Continue Shopping</h3>

            <p>Discover something beautiful for your home.</p>

            <Link to="/shop">Explore Shop</Link>
          </div>

          {/* LOGOUT */}

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </aside>
      </div>
    </section>
  );
};

export default Profile;
