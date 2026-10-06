import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";

import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Checkout from "./Pages/Checkout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Profile from "./Pages/Profile";
import AdminLogin from "./Pages/AdminLogin";
import Admin from "./Pages/Admin";
import Blog from "./Pages/Blog";
import About from "./Pages/About";

import SingleProduct from "./components/Single Product/SingleProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />

        {/* BLOG */}
        <Route
          path="/blog"
          element={
            <>
              <Header />
              <Blog />
              <Footer />
            </>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={
            <>
              <Header />
              <Shop />
              <Footer />
            </>
          }
        />

        {/* SINGLE PRODUCT */}
        <Route
          path="/product/:id"
          element={
            <>
              <Header />
              <SingleProduct />
              <Footer />
            </>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <>
              <Header />
              <Checkout />
              <Footer />
            </>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <>
              <Header />
              <Cart />
              <Footer />
            </>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <>
              <Header />
              <Profile />
              <Footer />
            </>
          }
        />

        {/* ADMIN LOGIN */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;