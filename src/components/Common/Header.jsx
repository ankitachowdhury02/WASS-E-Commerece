import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Package,
  LogOut,
  LogIn,
} from "lucide-react";

import logo from "../../assets/furniro-logo.png";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(null);

  const profileRef = useRef(null);

  const navigate = useNavigate();


  /* =========================
     FETCH USER PROFILE
  ========================= */

  useEffect(() => {
    const fetchUserProfile = async () => {

      const token = localStorage.getItem("token");

      // Login করা না থাকলে API call করবে না
      if (!token) {
        return;
      }

      try {

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


        const data = await response.json();

        console.log("Profile API Response:", data);


        if (!response.ok) {
          throw new Error(
            data.message || "Unable to fetch profile"
          );
        }


        /*
          Backend response যদি সরাসরি user data দেয়
          অথবা { user: {...} } দেয়,
          দুই ক্ষেত্রেই handle করবে।
        */

        setUser(data.user || data);

      } catch (error) {

        console.error(
          "Profile Fetch Error:",
          error
        );

      }
    };


    fetchUserProfile();

  }, []);


  /* =========================
     CLOSE DROPDOWN OUTSIDE CLICK
  ========================= */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, []);


  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {

    localStorage.removeItem("token");

    setUser(null);

    setProfileOpen(false);

    navigate("/login");

  };


  /* =========================
     MOBILE MENU CLOSE
  ========================= */

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };


  return (

    <header className="header">


      {/* =========================
          LOGO
      ========================= */}

      <div className="header-logo">

        <Link
          to="/"
          onClick={closeMobileMenu}
        >
          <img
            src={logo}
            alt="Furniro Logo"
          />
        </Link>

      </div>


      {/* =========================
          NAVBAR
      ========================= */}

      <nav
        className={`navbar ${
          menuOpen ? "active" : ""
        }`}
      >

        <Link
          to="/"
          onClick={closeMobileMenu}
        >
          Home
        </Link>


        <Link
          to="/shop"
          onClick={closeMobileMenu}
        >
          Shop
        </Link>


        <Link
          to="/about"
          onClick={closeMobileMenu}
        >
          About
        </Link>


        <Link
          to="/contact"
          onClick={closeMobileMenu}
        >
          Contact
        </Link>

      </nav>


      {/* =========================
          HEADER ICONS
      ========================= */}

      <div className="header-icons">


        {/* =========================
            PROFILE
        ========================= */}

        <div
          className="profile-wrapper"
          ref={profileRef}
        >

          <button
            className={`profile-icon-btn ${
              profileOpen ? "profile-active" : ""
            }`}
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
          >

            <UserRound size={26} />

          </button>


          {/* =========================
              PROFILE DROPDOWN
          ========================= */}

          {profileOpen && (

            <div className="profile-dropdown">


              {/* User Information */}

              <div className="profile-user-info">

                <div className="profile-avatar">

                  <UserRound size={25} />

                </div>


                <div className="profile-user-text">

                  <h3>
                    {user?.name || "Hello User"}
                  </h3>

                  <p>
                    {user?.phone
                      ? `+91 ${user.phone}`
                      : user?.email || "Please login"}
                  </p>

                </div>

              </div>


              {/* My Orders */}

              <Link
                to="/profile"
                className="profile-menu-item"
                onClick={() =>
                  setProfileOpen(false)
                }
              >

                <Package size={21} />

                <span>
                  My Orders
                </span>

              </Link>


              {/* My Profile */}

              <Link
                to="/profile"
                className="profile-menu-item"
                onClick={() =>
                  setProfileOpen(false)
                }
              >

                <UserRound size={21} />

                <span>
                  My Profile
                </span>

              </Link>


              {/* Logout or Login */}
              {user || localStorage.getItem("token") ? (
                <button
                  className="profile-menu-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={21} />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="profile-menu-item login-item"
                  onClick={() => setProfileOpen(false)}
                >
                  <LogIn size={21} />
                  <span>Login / Register</span>
                </Link>
              )}


            </div>

          )}

        </div>


        {/* =========================
            SEARCH
        ========================= */}

        <button
          className="icon-btn"
          type="button"
        >

          <Search size={26} />

        </button>


        {/* =========================
            WISHLIST
        ========================= */}

        <button
          className="icon-btn"
          type="button"
        >

          <Heart size={26} />

        </button>


        {/* =========================
            CART
        ========================= */}

        <Link
          to="/cart"
          className="icon-btn"
        >

          <ShoppingCart size={26} />

        </Link>


      </div>


      {/* =========================
          MOBILE MENU
      ========================= */}

      <button
        className="mobile-menu"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
      >

        {menuOpen ? (
          <X size={28} />
        ) : (
          <Menu size={28} />
        )}

      </button>


    </header>

  );
};


export default Header;