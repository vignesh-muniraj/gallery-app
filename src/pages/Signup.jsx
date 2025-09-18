import React from "react";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import TextField from "@mui/material/TextField";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../pages/Global";
import "../style.css";

export function Signup() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", confirmPassword: "" },
    validationSchema: object({
      username: string().required("Username required"),
      email: string().email("Invalid email").required("Email required"),
      password: string().required("Password required").min(8),
      confirmPassword: string().oneOf([ref("password"), null], "Passwords must match").required("Confirm password"),
    }),
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...userData } = values;
        const res = await fetch(`${API}/users/signup`, {
          method: "POST",
          body: JSON.stringify(userData),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/login");
        } else alert(data.error || "Signup failed");
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    },
  });

  return (
    <div className="page-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Signup</h2>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />
        <button type="submit">Signup</button>
        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
