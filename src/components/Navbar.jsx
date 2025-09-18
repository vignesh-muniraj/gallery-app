import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../style.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState("user");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (username) setUser({ username, role });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="app-name">PhotoGallery</span>
      </div>

      <div className="navbar-right">
        <div className="nav-links">
          <Link to="/">Gallery</Link>
          {user && <Link to="/upload">Upload</Link>}

          {user.role !== "admin" && <Link to="/mygallery">MyGallery</Link>}
        </div>

        <div style={{ position: "relative" }}>
          <AccountCircleIcon
            className="profile-icon"
            style={{ color: "white", fontSize: 32 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              {!user && <Link to="/login">Login</Link>}
              {user && <button onClick={handleLogout}>Logout</button>}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
