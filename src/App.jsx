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

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Pages with Header and Footer */}
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

        {/* Login page - NO Header, NO Footer */}
        <Route
          path="/login"
          element={<Login />}
        />


  <Route
          path="/register"
          element={<Register />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;