import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Furniro Logo" />
        </Link>
      </div>


      <nav className={`navbar ${menuOpen ? "active" : ""}`}>

        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

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