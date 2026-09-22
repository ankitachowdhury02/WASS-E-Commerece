import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";

import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Checkout from "./Pages/Checkout";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;