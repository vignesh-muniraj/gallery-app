// src/App.js
import { Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import MyGallery from "./pages/MyGallery";
import Upload from "./pages/Upload";
import EditImage from "./pages/EditImage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { IKContext } from "imagekitio-react";

function App() {
  return (
    <div>
      <Navbar />
       <IKContext
      publicKey="public_4acOG4I1AL51+sMWb9RAnqaggXo="
      urlEndpoint="https://ik.imagekit.io/vky"
      authenticationEndpoint="http://localhost:5000/auth"
    >
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/mygallery" element={<MyGallery />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/images/edit/:id" element={<EditImage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
      </IKContext>
    </div>
  );
}

export default App;
