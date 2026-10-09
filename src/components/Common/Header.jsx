import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  UserRound,
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

// Cart Sidebar
import CartSidebar from "../Cart Sidebar/CartSidebar";

const API_URL = "https://ecomm-qy13.onrender.com";

const Header = () => {
  // =====================================================
  // STATES
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [user, setUser] = useState(null);

  // Product Details page-এর Cart Sidebar
  const [cartSidebarOpen, setCartSidebarOpen] =
    useState(false);

  // =====================================================
  // REFS
  // =====================================================

  const profileRef = useRef(null);

  // =====================================================
  // ROUTER
  // =====================================================

  const navigate = useNavigate();

  const location = useLocation();

  // =====================================================
  // CHECK PRODUCT DETAILS PAGE
  // =====================================================

  /*
    Product Details URL যদি হয়:

    /product/1
    /product/25
    /product/100

    তাহলে এই condition true হবে।
  */

  const isProductDetailsPage =
    location.pathname.startsWith("/product/");

  // =====================================================
  // REFRESH ACCESS TOKEN
  // =====================================================

  const refreshAccessToken = async () => {
    const refreshToken =
      localStorage.getItem("refreshToken");

    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/refresh`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            refreshToken: refreshToken,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Refresh API Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to refresh token"
        );
      }

      // Backend-এর common token formats handle

      const newAccessToken =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "New access token not received."
        );
      }

      localStorage.setItem(
        "token",
        newAccessToken
      );

      return newAccessToken;
    } catch (error) {
      console.error(
        "Refresh Token Error:",
        error
      );

      localStorage.removeItem("token");

      localStorage.removeItem(
        "refreshToken"
      );

      return null;
    }
  };

  // =====================================================
  // FETCH USER PROFILE
  // =====================================================

  const fetchUserProfile = async () => {
    let token =
      localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      let response = await fetch(
        `${API_URL}/api/users/profile`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      let data = await response.json();

      console.log(
        "Profile API Status:",
        response.status
      );

      console.log(
        "Profile API Response:",
        data
      );

      // =================================================
      // TOKEN EXPIRED
      // =================================================

      if (response.status === 401) {
        console.log(
          "Access token expired. Trying refresh token..."
        );

        const newToken =
          await refreshAccessToken();

        if (!newToken) {
          setUser(null);
          return;
        }

        // New token দিয়ে আবার profile call

        response = await fetch(
          `${API_URL}/api/users/profile`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${newToken}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        data = await response.json();

        console.log(
          "Profile API After Refresh:",
          data
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch profile"
        );
      }

      // =================================================
      // GET USER DATA
      // =================================================

      const userData =
        data.user ||
        data.data?.user ||
        data.data ||
        data;

      console.log(
        "Final User Data:",
        userData
      );

      setUser(userData);
    } catch (error) {
      console.error(
        "Profile Fetch Error:",
        error
      );

      setUser(null);
    }
  };

  // =====================================================
  // FETCH PROFILE ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // =====================================================
  // CLOSE PROFILE DROPDOWN OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target
        )
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

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    let token =
      localStorage.getItem("token");

    try {
      // =================================================
      // LOGOUT API
      // =================================================

      if (token) {
        let response = await fetch(
          `${API_URL}/api/auth/logout`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        let data = await response.json();

        console.log(
          "Logout API Status:",
          response.status
        );

        console.log(
          "Logout API Response:",
          data
        );

        // =================================================
        // ACCESS TOKEN EXPIRED
        // =================================================

        if (response.status === 401) {
          console.log(
            "Access token expired during logout. Refreshing..."
          );

          const newToken =
            await refreshAccessToken();

          if (newToken) {
            response = await fetch(
              `${API_URL}/api/auth/logout`,
              {
                method: "POST",

                headers: {
                  Authorization: `Bearer ${newToken}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

            data = await response.json();

            console.log(
              "Logout After Refresh:",
              data
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Logout Error:",
        error
      );
    } finally {
      // =================================================
      // CLEAR LOCAL SESSION
      // =================================================

      localStorage.removeItem("token");

      localStorage.removeItem(
        "refreshToken"
      );

      setUser(null);

      setProfileOpen(false);

      setMenuOpen(false);

      // Sidebar বন্ধ

      setCartSidebarOpen(false);

      navigate("/login");
    }
  };

  // =====================================================
  // MOBILE MENU CLOSE
  // =====================================================

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // CART BUTTON FUNCTION
  // =====================================================

  const handleCartClick = () => {
    /*
      যদি Product Details page হয়:

      /product/1
      /product/2
      /product/100

      তাহলে Cart Sidebar খুলবে।
    */

    if (isProductDetailsPage) {
      setCartSidebarOpen(true);

      return;
    }

    /*
      অন্য সব page-এ আগের মতো
      /cart page-এ যাবে।
    */

    navigate("/cart");
  };

  // =====================================================
  // ORDERS BUTTON FUNCTION
  // =====================================================

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  // =====================================================
  // WISHLIST BUTTON FUNCTION
  // =====================================================

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <>
      <header className="header">

        {/* =================================================
            LOGO
        ================================================= */}

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

        {/* =================================================
            NAVBAR
        ================================================= */}

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

        {/* =================================================
            HEADER ICONS
        ================================================= */}

        <div className="header-icons">

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            className="profile-wrapper"
            ref={profileRef}
          >

            <button
              type="button"
              className={`profile-icon-btn ${
                profileOpen
                  ? "profile-active"
                  : ""
              }`}
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
            >
              <UserRound size={26} />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div className="profile-dropdown">

                {/* USER INFO */}

                <div className="profile-user-info">

                  <div className="profile-avatar">
                    <UserRound size={25} />
                  </div>

                  <div className="profile-user-text">

                    <h3>
                      {user?.name ||
                        user?.fullName ||
                        "User"}
                    </h3>

                    <p>
                      {user?.phone
                        ? `+91 ${user.phone}`
                        : user?.email ||
                          "Please login"}
                    </p>

                  </div>

                </div>

                {/* MY ORDERS */}

                <Link
                  to="/orders"
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

                {/* MY PROFILE */}

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

                {/* LOGIN / LOGOUT */}

                {user ||
                localStorage.getItem(
                  "token"
                ) ? (
                  <button
                    type="button"
                    className="profile-menu-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut size={21} />

                    <span>
                      Logout
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="profile-menu-item login-item"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                  >
                    <LogIn size={21} />

                    <span>
                      Login / Register
                    </span>
                  </Link>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              ORDERS
          ================================================= */}

          <button
            className="icon-btn"
            type="button"
            onClick={handleOrdersClick}
            title="My Orders"
            aria-label="My Orders"
          >
            <Package size={26} />
          </button>

          {/* =================================================
              WISHLIST
          ================================================= */}

          <button
            className="icon-btn"
            type="button"
            onClick={handleWishlistClick}
          >
            <Heart size={26} />
          </button>

          {/* =================================================
              CART
          ================================================= */}

          <button
            type="button"
            className="icon-btn"
            onClick={handleCartClick}
          >
            <ShoppingCart size={26} />
          </button>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <button
          type="button"
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

      {/* FIXED HEADER SPACER */}
      <div className="header-spacer" aria-hidden="true" />

      {/* =====================================================
          PRODUCT DETAILS CART SIDEBAR
      ===================================================== */}

      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() =>
          setCartSidebarOpen(false)
        }
      />

    </>
  );
};

export default Header;