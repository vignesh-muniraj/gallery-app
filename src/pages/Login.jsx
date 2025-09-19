import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../Global";

 function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: object({
      username: string().required("Username required"),
      password: string().required("Password required").min(8),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/users/login`, {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("role", data.user.role);
          navigate("/");
        } else setError(data.error || "Login failed");
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="page-container">
      <form onSubmit={formik.handleSubmit}>
        <h2>Login</h2>
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
          type="password"
          label="Password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit" fullWidth variant="contained" color="success" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <p style={{ marginTop: "1rem" }}>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}
export default Login