import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { object, string, array } from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../Global";

const EditImageSchema = object({
  title: string().required("Please enter a title"),
  description: string().required("Please enter description"),
  url: string().url("Enter a valid URL").required("Image URL required"),
  tags: array().min(1, "Enter at least one tag"),
});

export default function EditImage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { handleSubmit, values, handleChange, handleBlur, errors, touched, setValues, setFieldValue } =
    useFormik({
      initialValues: { title: "", description: "", url: "", tags: [] },
      validationSchema: EditImageSchema,
      onSubmit: async (vals) => {
        const payload = { ...vals, tags };
        try {
          await fetch(`${API}/images/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
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
        setValues({ title: data.title, description: data.description, url: data.url, tags: data.tags || [] });
        setTags(data.tags || []);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    fetchImage();
  }, [id, setValues]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      const newTags = [...tags, t];
      setTags(newTags);
      setFieldValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (t) => {
    const newTags = tags.filter((x) => x !== t);
    setTags(newTags);
    setFieldValue("tags", newTags);
  };

  if (loading) return <div className="loading"><CircularProgress size="3rem" /></div>;
  if (error) return <h2>Something went wrong 😔</h2>;

  return (
    <div className="page-container">
      <h2>Edit Image</h2>
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
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          name="url"
          value={values.url}
          onChange={handleChange}
          onBlur={handleBlur}
          helperText={touched.url && errors.url}
          error={touched.url && Boolean(errors.url)}
          className="form-field"
        />

        <div className="tag-container" style={{ marginBottom: 8 }}>
          {tags.map((t, i) => (
            <span key={i} className="tag" onClick={() => removeTag(t)}>
              {t} ✕
            </span>
          ))}
        </div>
        {touched.tags && errors.tags && <p style={{ color: "red" }}>{errors.tags}</p>}

        <TextField
          label="Add Tag"
          variant="outlined"
          fullWidth
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          className="form-field"
        />

        <Button type="submit" variant="contained" color="success" fullWidth style={{ marginTop: 12 }}>
          Save
        </Button>
      </form>
    </div>
  );
}
