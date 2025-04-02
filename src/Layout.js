import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./Dashboard.css";
import logo from "./logo.png";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) setFirstName(storedFirstName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </div>
        <div className="logo-wrapper">
          <img src={logo} className="logo-center" alt="logo" />
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="sidebar">
          <p onClick={() => navigate("/dashboard")}>Dashboard</p>
          <p onClick={() => navigate("/groups")}>Joined Groups</p>
          <p onClick={() => navigate("/create-group")}>Create Group</p>
          <p onClick={() => navigate("/profile")}>Profile</p>
          <p onClick={handleLogout}>Log Out</p>
        </div>
      )}

      {/* Page Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
