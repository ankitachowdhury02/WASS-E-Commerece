import React, { useState } from "react";
import {
  UserRound,
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X
} from "lucide-react";

import logo from "../../assets/furniro-logo.png";
import "./Header.css";


const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">

      <div className="header-logo">
        <a href="/">
          <img src={logo} alt="Furniro Logo" />
        </a>
      </div>


      <nav className={`navbar ${menuOpen ? "active" : ""}`}>

        <a href="/">Home</a>
        <a href="/shop">Shop</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>

      </nav>


      <div className="header-icons">

        <button className="icon-btn">
          <UserRound size={26} />
        </button>

        <button className="icon-btn">
          <Search size={26} />
        </button>

        <button className="icon-btn">
          <Heart size={26} />
        </button>

        <button className="icon-btn">
          <ShoppingCart size={26} />
        </button>

      </div>


      {/* Mobile Menu */}
      <button
        className="mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
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