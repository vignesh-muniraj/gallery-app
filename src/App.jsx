import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Upload } from "./pages/Upload";
import Gallery from "./pages/Gallery";
import MyGallery from "./pages/MyGallery";
import "./style.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/mygallery" element={<MyGallery />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
