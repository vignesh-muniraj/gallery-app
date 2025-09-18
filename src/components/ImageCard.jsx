import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ImageCard({ image, onEdit, onDelete, canEdit, canDelete }) {
  return (
    <div className="image-card">
      <img src={image.url} alt={image.title} />
      <h4>{image.title}</h4>
      <p>{image.description}</p>
      {image.tags && (
        <div className="tag-container">
          {image.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="card-buttons">
        {canEdit && (
          <button onClick={() => onEdit(image)}>
            <EditIcon style={{ color: "#1976d2" }} />
          </button>
        )}
        {canDelete && (
          <button onClick={() => onDelete(image)}>
            <DeleteIcon style={{ color: "red" }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
