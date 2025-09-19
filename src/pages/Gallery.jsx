import React, { useState, useEffect } from "react";
import ImageCard from "../components/ImageCard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { API } from "../Global";

function Gallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role");

  // ✅ fetch all images
  async function fetchImages() {
    try {
      const response = await fetch(`${API}/images`);
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  // ✅ delete image (only admin)
  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure to delete this image?")) return;
    await fetch(`${API}/images/${id}`, { method: "DELETE" });
    fetchImages();
  };

  // ✅ filter images by title or description
  const filteredImages = images.filter(
    (img) =>
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="gallery-page">
      {/* Search bar */}
      <div className="search-container">
        <TextField
          label="Search by title or description"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Gallery */}
      <div className="gallery-container">
        {filteredImages.length > 0 ? (
          filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              editBtn={
                (userRole === "admin" || image.userId === userId) && (
                  <IconButton
                    onClick={() => navigate(`/images/edit/${image.id}`)}
                    color="secondary"
                  >
                    <EditIcon />
                  </IconButton>
                )
              }
              deleteBtn={
                userRole === "admin" && (
                  <IconButton
                    onClick={() => deleteImage(image.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )
              }
            />
          ))
        ) : (
          <p className="no-images">No images found.</p>
        )}
      </div>
    </div>
  );
}

export default Gallery;
