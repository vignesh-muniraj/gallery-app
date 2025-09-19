// src/pages/MyGallery.js
import React, { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { API } from "../Global";

function MyGallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const userId = localStorage.getItem("id");

  // ✅ fetch only my images
  async function fetchUserImages() {
    try {
      const response = await fetch(`${API}/images?userId=${userId}`);
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error("Error fetching user images:", err);
    }
  }

  useEffect(() => {
    fetchUserImages();
  }, []);

  return (
    <div className="gallery-container">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          editBtn={
            <IconButton
              onClick={() => navigate(`/images/edit/${image.id}`)}
              color="secondary"
            >
              <EditIcon />
            </IconButton>
          }
        />
      ))}
    </div>
  );
}

export default MyGallery;
