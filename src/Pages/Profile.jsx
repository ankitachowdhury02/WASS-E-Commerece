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

const Profile = () => {
  const navigate = useNavigate();

  // =========================
  // USER DATA
  // =========================

  const [user, setUser] = useState(null);

  // =========================
  // LOADING
  // =========================

  const [loading, setLoading] = useState(true);

  // =========================
  // ERROR
  // =========================

  const [error, setError] = useState("");


  // =========================
  // FETCH PROFILE
  // =========================

  useEffect(() => {

    const fetchProfile = async () => {

      // Get token from localStorage
      const token = localStorage.getItem("token");

      console.log("================================");
      console.log("PROFILE TOKEN:", token);
      console.log("================================");


      // Token না থাকলে Login page
      if (!token) {

        console.log("No token found.");

        setError(
          "You are not logged in."
        );

        setLoading(false);

        return;
      }


      try {

        // =========================
        // PROFILE API
        // =========================

        const response = await fetch(
          "https://ecomm-qy13.onrender.com/api/users/profile",
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );


        // Convert response to JSON
        const data = await response.json();


        // =========================
        // FULL API RESPONSE
        // =========================

        console.log(
          "================================"
        );

        console.log(
          "PROFILE API RESPONSE:"
        );

        console.log(
          JSON.stringify(data, null, 2)
        );

        console.log(
          "================================"
        );


        // =========================
        // API ERROR
        // =========================

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Unable to load profile."
          );
        }


        // =========================
        // FIND USER DATA
        // =========================

        const userData =
          data.user ||
          data.data?.user ||
          data.data ||
          data;


        console.log(
          "FINAL USER DATA:"
        );

        console.log(
          JSON.stringify(
            userData,
            null,
            2
          )
        );


        // Save user data
        setUser(userData);


      } catch (err) {

        console.error(
          "PROFILE ERROR:",
          err
        );

        setError(
          err.message ||
          "Unable to fetch profile."
        );

      } finally {

        setLoading(false);

      }
    };


    fetchProfile();

  }, []);


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    // Remove token
    localStorage.removeItem("token");

    // Clear user
    setUser(null);

    // Go Login
    navigate("/login");

  };


  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {

    return (
      <section className="profile-loading">

        <div className="profile-loader"></div>

        <p>
          Loading your account...
        </p>

      </section>
    );
  }


  // =========================
  // ERROR SCREEN
  // =========================

  if (error) {

    return (
      <section className="profile-error">

        <div className="profile-error-box">

          <h2>
            Unable to load account
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>

        </div>

      </section>
    );
  }


  // =========================
  // PROFILE PAGE
  // =========================

  return (
    <section className="profile-page">


      {/* =================================
          PROFILE HEADER
      ================================= */}

      <div className="profile-cover">

        <div className="profile-cover-content">


          {/* Avatar */}

          <div className="profile-avatar">

            <UserRound size={45} />

          </div>


          {/* User Heading */}

          <div className="profile-heading">

            <p>
              MY ACCOUNT
            </p>


            <h1>
              {user?.name ||
                user?.fullName ||
                "User"}
            </h1>


            <span>
              {user?.email ||
                "Email not available"}
            </span>

          </div>

        </div>

      </div>



      {/* =================================
          MAIN CONTAINER
      ================================= */}

      <div className="profile-container">


        {/* =================================
            LEFT SIDE
        ================================= */}

        <div className="profile-main">


          {/* =================================
              PERSONAL INFORMATION
          ================================= */}

          <div className="profile-card">


            <div className="profile-card-heading">


              <div>

                <p className="small-title">
                  ACCOUNT INFORMATION
                </p>

                <h2>
                  Personal Details
                </h2>

              </div>


              <button
                className="edit-button"
                type="button"
              >

                <Edit3 size={16} />

                Edit

              </button>

            </div>



            {/* Details */}

            <div className="profile-details">


              {/* =========================
                  NAME
              ========================= */}

              <div className="detail-item">

                <div className="detail-icon">

                  <UserRound size={19} />

                </div>


                <div>

                  <span>
                    Full Name
                  </span>


                  <strong>

                    {user?.name ||
                      user?.fullName ||
                      "Not available"}

                  </strong>

                </div>

              </div>



              {/* =========================
                  EMAIL
              ========================= */}

              <div className="detail-item">

                <div className="detail-icon">

                  <Mail size={19} />

                </div>


                <div>

                  <span>
                    Email Address
                  </span>


                  <strong>

                    {user?.email ||
                      "Not available"}

                  </strong>

                </div>

              </div>



              {/* =========================
                  PHONE
              ========================= */}

              <div className="detail-item">

                <div className="detail-icon">

                  <Phone size={19} />

                </div>


                <div>

                  <span>
                    Phone Number
                  </span>


                  <strong>

                    {user?.phone
                      ? `+91 ${user.phone}`
                      : "Not available"}

                  </strong>

                </div>

              </div>

            </div>

          </div>



          {/* =================================
              QUICK ACCESS
          ================================= */}

          <div className="profile-card">


            <div className="profile-card-heading">

              <div>

                <p className="small-title">
                  QUICK ACCESS
                </p>

                <h2>
                  My Account
                </h2>

              </div>

            </div>



            <div className="account-grid">


              {/* =========================
                  CART
              ========================= */}

              <Link
                to="/cart"
                className="account-option"
              >

                <div className="option-icon">

                  <ShoppingCart
                    size={22}
                  />

                </div>


                <div>

                  <h3>
                    My Cart
                  </h3>

                  <p>
                    View your selected products
                  </p>

                </div>

              </Link>



              {/* =========================
                  ORDERS
              ========================= */}

              <div className="account-option">

                <div className="option-icon">

                  <Package
                    size={22}
                  />

                </div>


                <div>

                  <h3>
                    My Orders
                  </h3>

                  <p>
                    Track your recent orders
                  </p>

                </div>

              </div>



              {/* =========================
                  WISHLIST
              ========================= */}

              <div className="account-option">

                <div className="option-icon">

                  <Heart
                    size={22}
                  />

                </div>


                <div>

                  <h3>
                    Wishlist
                  </h3>

                  <p>
                    View your favourite products
                  </p>

                </div>

              </div>



              {/* =========================
                  SECURITY
              ========================= */}

              <div className="account-option">

                <div className="option-icon">

                  <ShieldCheck
                    size={22}
                  />

                </div>


                <div>

                  <h3>
                    Security
                  </h3>

                  <p>
                    Manage account security
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* =================================
            RIGHT SIDEBAR
        ================================= */}

        <aside className="profile-sidebar">


          {/* =========================
              ACCOUNT STATUS
          ========================= */}

          <div className="account-status">


            <div className="status-icon">

              <ShieldCheck
                size={24}
              />

            </div>


            <p>
              ACCOUNT STATUS
            </p>


            <h3>
              Active Account
            </h3>


            <span>
              Your account is active and secure.
            </span>

          </div>



          {/* =========================
              SHOPPING
          ========================= */}

          <div className="profile-side-card">


            <p className="small-title">
              SHOPPING
            </p>


            <h3>
              Continue Shopping
            </h3>


            <p>
              Discover something beautiful
              for your home.
            </p>


            <Link to="/shop">
              Explore Shop
            </Link>

          </div>



          {/* =========================
              LOGOUT
          ========================= */}

          <button
            className="logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            Logout

          </button>

        </aside>

      </div>

    </section>
  );
};

export default Profile;