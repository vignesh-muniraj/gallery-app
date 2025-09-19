// // // src/pages/Upload.jsx
// // import React, { useState } from "react";
// // import { API } from "../Global";

// // // ✅ Upload form is used for BOTH upload and edit
// // function Upload({ editData, onSuccess }) {
// //   // If editData exists → show old values, else empty fields
// //   const [title, setTitle] = useState(editData ? editData.title : "");
// //   const [description, setDescription] = useState(
// //     editData ? editData.description : ""
// //   );
// //   const [tag, setTag] = useState(editData ? editData.tag : "");

// //   // ✅ handle form submit
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // -------- If editing an existing image --------
// //     if (editData) {
// //       try {
// //         const res = await fetch(`${API}/images/${editData.id}`, {
// //           method: "PUT", // update request
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //           body: JSON.stringify({
// //             title,
// //             description,
// //             tag,
// //           }),
// //         });

// //         const data = await res.json();
// //         if (data.success) {
// //           // ✅ send updated image back to MyGallery
// //           onSuccess(data.image);
// //           alert("Image updated successfully!");
// //         }
// //       } catch (err) {
// //         console.error("Update failed", err);
// //       }
// //     } else {
// //       // -------- If adding a new image --------
// //       try {
// //         const res = await fetch(`${API}/images`, {
// //           method: "POST", // new upload request
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //           body: JSON.stringify({
// //             title,
// //             description,
// //             tag,
// //             userId: localStorage.getItem("id"),
// //           }),
// //         });

// //         const data = await res.json();
// //         if (data.success) {
// //           alert("Image uploaded successfully!");
// //           // Optional: clear form after upload
// //           setTitle("");
// //           setDescription("");
// //           setTag("");
// //         }
// //       } catch (err) {
// //         console.error("Upload failed", err);
// //       }
// //     }
// //   };

// //   return (
// //     <div className="upload-form">
// //       {/* ✅ Heading changes based on mode */}
// //       <h2>{editData ? "Edit Image" : "Upload Image"}</h2>

// //       <form onSubmit={handleSubmit}>
// //         {/* Title */}
// //         <input
// //           type="text"
// //           placeholder="Enter title"
// //           value={title}
// //           onChange={(e) => setTitle(e.target.value)}
// //           required
// //         />

// //         {/* Description */}
// //         <textarea
// //           placeholder="Enter description"
// //           value={description}
// //           onChange={(e) => setDescription(e.target.value)}
// //           required
// //         />

// //         {/* Tag */}
// //         <input
// //           type="text"
// //           placeholder="Enter tag"
// //           value={tag}
// //           onChange={(e) => setTag(e.target.value)}
// //           required
// //         />

// //         {/* Submit button */}
// //         <button type="submit">{editData ? "Update" : "Upload"}</button>
// //       </form>
// //     </div>
// //   );
// // }
// // export default Upload;
// // src/pages/Upload.jsx
// // src/pages/Upload.jsx
// // src/pages/Upload.jsx
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import { object, string, array } from "yup";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { useNavigate } from "react-router-dom";
// import { API } from "../Global";
// import "../style.css";

// export default function Upload() {
//   const navigate = useNavigate();
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");

//   const UploadSchema = object({
//     title: string().required("Title is required"),
//     description: string().required("Description is required"),
//     url: string().url("Enter valid URL").required("Image URL required"),
//     tags: array().min(1, "At least one tag is required"),
//   });

//   const { handleSubmit, values, handleChange, handleBlur, errors, touched, setFieldValue } = useFormik({
//     initialValues: { title: "", description: "", url: "", tags: [] },
//     validationSchema: UploadSchema,
//     onSubmit: async (vals) => {
//       const payload = {
//         title: vals.title,
//         description: vals.description,
//         url: vals.url,
//         tags: tags,
//         userId: localStorage.getItem("id"),
//       };

//       try {
//         const res = await fetch(`${API}/images`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify(payload),
//         });
//         const data = await res.json();
//         alert("Uploaded successfully");
//         navigate("/gallery");
//       } catch (err) {
//         console.error(err);
//         alert("Upload failed");
//       }
//     },
//   });

//   const addTag = () => {
//     const t = tagInput.trim();
//     if (t && !tags.includes(t)) {
//       const newTags = [...tags, t];
//       setTags(newTags);
//       setFieldValue("tags", newTags);
//       setTagInput("");
//     }
//   };

//   const removeTag = (t) => {
//     const newTags = tags.filter((x) => x !== t);
//     setTags(newTags);
//     setFieldValue("tags", newTags);
//   };

//   return (
//     <div className="page-container">
//       <h2>Upload Image</h2>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Title"
//           variant="outlined"
//           fullWidth
//           name="title"
//           value={values.title}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           helperText={touched.title && errors.title}
//           error={touched.title && Boolean(errors.title)}
//           className="form-field"
//         />
//         <TextField
//           label="Description"
//           variant="outlined"
//           fullWidth
//           multiline
//           rows={4}
//           name="description"
//           value={values.description}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           helperText={touched.description && errors.description}
//           error={touched.description && Boolean(errors.description)}
//           className="form-field"
//         />
//         <TextField
//           label="Image URL"
//           variant="outlined"
//           fullWidth
//           name="url"
//           value={values.url}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           helperText={touched.url && errors.url}
//           error={touched.url && Boolean(errors.url)}
//           className="form-field"
//         />

//         {/* Tags */}
//         <div className="tag-container" style={{ marginBottom: 8 }}>
//           {tags.map((t, i) => (
//             <span key={i} className="tag" onClick={() => removeTag(t)}>
//               {t} ✕
//             </span>
//           ))}
//         </div>
//         {touched.tags && errors.tags && <p style={{ color: "red" }}>{errors.tags}</p>}

//         <TextField
//           label="Add Tag"
//           variant="outlined"
//           fullWidth
//           value={tagInput}
//           onChange={(e) => setTagInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
//           className="form-field"
//         />

//         <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 12 }}>
//           Upload
//         </Button>
//       </form>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useFormik } from "formik";
import { object, string, array } from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { API } from "../Global";
import { IKUpload } from "imagekitio-react";
import "../style.css";

const UploadSchema = object({
  title: string().required("Title is required"),
  description: string().required("Description is required"),
  url: string().url("Upload or provide valid URL").required("Image required"),
  tags: array().min(1, "At least one tag is required"),
});

export default function Upload() {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");

  const {
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: { title: "", description: "", url: "", tags: [] },
    validationSchema: UploadSchema,
    onSubmit: async (vals) => {
      try {
        const res = await fetch(`${API}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...vals,
            userId: localStorage.getItem("id"),
          }),
        });
        await res.json();
        alert("Uploaded successfully");
        navigate("/gallery");
      } catch (err) {
        console.error(err);
        alert("Upload failed");
      }
    },
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !values.tags.includes(t)) {
      setFieldValue("tags", [...values.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t) => {
    setFieldValue("tags", values.tags.filter((x) => x !== t));
  };

  // ✅ ImageKit upload success
  const onUploadSuccess = (res) => {
    setFieldValue("url", res.url); // Save uploaded image URL
  };

  const onUploadError = (err) => {
    console.error("Upload error:", err);
    alert("Image upload failed");
  };

  return (
    <div className="page-container">
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.title && errors.title}
          error={touched.title && Boolean(errors.title)}
          className="form-field"
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.description && errors.description}
          error={touched.description && Boolean(errors.description)}
          className="form-field"
        />

        {/* ✅ ImageKit Upload */}
        <div style={{ margin: "12px 0" }}>
          <IKUpload
            fileName={`image-${Date.now()}`}
            folder="/react-gallery/"
            onError={onUploadError}
            onSuccess={onUploadSuccess}
            authenticationEndpoint={`${API}/auth`} // Flask endpoint for token
          />
          {values.url && (
            <img
              src={values.url}
              alt="Preview"
              style={{ width: 200, marginTop: 10 }}
            />
          )}
          {touched.url && errors.url && (
            <p style={{ color: "red" }}>{errors.url}</p>
          )}
        </div>

        {/* Tags */}
        <div className="tag-container">
          {values.tags.map((t, i) => (
            <span key={i} className="tag" onClick={() => removeTag(t)}>
              {t} ✕
            </span>
          ))}
        </div>
        {touched.tags && errors.tags && (
          <p style={{ color: "red" }}>{errors.tags}</p>
        )}

        <TextField
          label="Add Tag"
          variant="outlined"
          fullWidth
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          className="form-field"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 12 }}
        >
          Upload
        </Button>
      </form>
    </div>
  );
}
