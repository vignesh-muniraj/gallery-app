import React, { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import { API } from "../pages/Global";
import "../style.css";

function Gallery() {
  const [images, setImages] = useState([]);
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${API}/images`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) 
        setImages(data.images);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (image) => {
    // You can use a modal or redirect to Upload with editData
    // For simplicity, alert
    alert(`Edit ${image.title} functionality`);
  };

  const handleDelete = async (image) => {
    if (!window.confirm("Are you sure to delete this image?")) return;
    try {
      const res = await fetch(`${API}/images/${image.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) 
        setImages(images.filter((img) => img.id !== image.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="gallery-container">
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          canEdit={userRole === "admin" || img.userId === userId}
          canDelete={userRole === "admin"}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default Gallery;
