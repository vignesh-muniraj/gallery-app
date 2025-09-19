import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "../style.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load user info from localStorage
  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (username) setUser({ username, role });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDropdownOpen(false); // close dropdown
    navigate("/login");
  };

  const handleLinkClick = () => {
    // close dropdown when a link inside dropdown is clicked
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="app-name">PhotoGallery</span>
      </div>

      <div className="navbar-right">
        <div className="nav-links">
          <Link to="/" onClick={handleLinkClick}>Gallery</Link>
           <Link to="/upload" onClick={handleLinkClick}>Upload</Link>
          {user && user.role !== "admin" && <Link to="/mygallery" onClick={handleLinkClick}>MyGallery</Link>}
        </div>

        <div style={{ position: "relative" }}>
          <AccountCircleIcon
            className="profile-icon"
            style={{ color: "white", fontSize: 32 }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              {!user && <Link to="/login" onClick={handleLinkClick}>Login</Link>}
              {user && <button onClick={handleLogout}>Logout</button>}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
