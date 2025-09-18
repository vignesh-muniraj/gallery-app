// src/pages/Upload.jsx
import React, { useState } from "react";
import { API } from "../Global";
import "../style.css";

// ✅ Upload form is used for BOTH upload and edit
export function Upload({ editData, onSuccess }) {
  // If editData exists → show old values, else empty fields
  const [title, setTitle] = useState(editData ? editData.title : "");
  const [description, setDescription] = useState(editData ? editData.description : "");
  const [tag, setTag] = useState(editData ? editData.tag : "");

  // ✅ handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------- If editing an existing image --------
    if (editData) {
      try {
        const res = await fetch(`${API}/images/${editData.id}`, {
          method: "PUT", // update request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            description,
            tag,
          }),
        });

        const data = await res.json();
        if (data.success) {
          // ✅ send updated image back to MyGallery
          onSuccess(data.image);
          alert("Image updated successfully!");
        }
      } catch (err) {
        console.error("Update failed", err);
      }
    } else {
      // -------- If adding a new image --------
      try {
        const res = await fetch(`${API}/images`, {
          method: "POST", // new upload request
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            description,
            tag,
            userId: localStorage.getItem("id"),
          }),
        });

        const data = await res.json();
        if (data.success) {
          alert("Image uploaded successfully!");
          // Optional: clear form after upload
          setTitle("");
          setDescription("");
          setTag("");
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <div className="upload-form">
      {/* ✅ Heading changes based on mode */}
      <h2>{editData ? "Edit Image" : "Upload Image"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Tag */}
        <input
          type="text"
          placeholder="Enter tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          required
        />

        {/* Submit button */}
        <button type="submit">
          {editData ? "Update" : "Upload"}
        </button>
      </form>
    </div>
  );
}
