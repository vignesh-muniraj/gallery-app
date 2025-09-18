import React, { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard"; // shows single image card
import { Upload } from "./Upload"; // we will reuse upload form for editing
import { API } from "../Global";
import "../style.css";

function MyGallery() {
  const [images, setImages] = useState([]); // store my uploaded images
  const [editingImage, setEditingImage] = useState(null); // store image which I am editing

  const userId = localStorage.getItem("id"); // get logged-in user id

  // ✅ fetch only my images from backend
  useEffect(() => {
    fetchMyImages();
  }, []);

  const fetchMyImages = async () => {
    try {
      const res = await fetch(`${API}/images/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) {
        setImages(data.images); // save my images into state
      }
    } catch (err) {
      console.error("Error while fetching my images:", err);
    }
  };

  // ✅ open edit form (modal/box) with existing data
  const handleEdit = (image) => {
    setEditingImage(image); // store selected image for editing
  };

  // ✅ close edit form
  const handleClose = () => {
    setEditingImage(null);
  };

  return (
    <div className="gallery-container">
      {/* ✅ loop through my images */}
      {images.map((img) => (
        <ImageCard
          key={img.id}
          image={img}
          canEdit={true} // normal user can edit their own image
          canDelete={false} // normal user cannot delete
          onEdit={handleEdit}
        />
      ))}

      {/* ✅ show edit form only if user clicked edit */}
      {editingImage && (
        <div className="edit-modal">
          <div className="edit-box">
            <h3>Edit My Image</h3>

            {/* ✅ reuse Upload form with old data */}
            <Upload
              editData={editingImage} // pass existing image data
              onSuccess={(updatedImage) => {
                // update that image inside state
                const updated = images.map((img) =>
                  img.id === updatedImage.id ? updatedImage : img
                );
                setImages(updated);
                handleClose(); // close modal after saving
              }}
            />

            <button className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGallery;
