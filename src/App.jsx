import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Common/Header";
import Footer from "./components/Common/Footer";

import Home from "./Pages/Home";
import Contact from "./Pages/Contact";

function App() {
  return (
    <BrowserRouter>

      <Header />

      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;