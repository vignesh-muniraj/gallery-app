import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { object, string, array } from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../Global";
import { IKUpload } from "imagekitio-react";

const EditImageSchema = object({
  title: string().required("Please enter a title"),
  description: string().required("Please enter description"),
  url: string().url("Upload or provide a valid URL").required("Image required"),
  tags: array().min(1, "Enter at least one tag"),
});

export default function EditImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    handleSubmit,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: { title: "", description: "", url: "", tags: [] },
    validationSchema: EditImageSchema,
    onSubmit: async (vals) => {
      try {
        await fetch(`${API}/images/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vals),
        });
        alert("Updated successfully");
        navigate("/gallery");
      } catch {
        alert("Update failed");
      }
    },
  });

  useEffect(() => {
    async function fetchImage() {
      try {
        const res = await fetch(`${API}/images/${id}`);
        const data = await res.json();
        setValues({
          title: data.title,
          description: data.description,
          url: data.url,
          tags: data.tags || [],
        });
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    fetchImage();
  }, [id, setValues]);

  // Tags
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !values.tags.includes(t)) {
      setFieldValue("tags", [...values.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t) => {
    setFieldValue(
      "tags",
      values.tags.filter((x) => x !== t)
    );
  };

  // ✅ ImageKit upload success handler
  const onUploadSuccess = (res) => {
    console.log("Upload success:", res);
    setFieldValue("url", res.url); // Save the uploaded URL in formik
  };

  // ✅ ImageKit upload error handler
  const onUploadError = (err) => {
    console.error("Upload error:", err);
    alert("Image upload failed");
  };

  if (loading)
    return (
      <div className="loading">
        <CircularProgress size="3rem" />
      </div>
    );
  if (error) return <h2>Something went wrong 😔</h2>;

  return (
    <div className="page-container">
      <h2>Edit Image</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          name="title"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.title && errors.title}
          error={touched.title && Boolean(errors.title)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          name="description"
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.description && errors.description}
          error={touched.description && Boolean(errors.description)}
          style={{ marginTop: 12 }}
        />

        {/* ✅ ImageKit Upload */}
        <div style={{ margin: "12px 0" }}>
          <IKUpload
            fileName={`image-${Date.now()}`} // optional
            folder="/react-gallery/"
            onError={onUploadError}
            onSuccess={onUploadSuccess}
            authenticationEndpoint={`${API}/auth`}
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
          fullWidth
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          style={{ marginTop: 12 }}
        >
          Save
        </Button>
      </form>
    </div>
  );
}
