import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import logo from "./logo.png";
import profileIcon from "./profile-icon.png";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) setFirstName(storedFirstName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
          <p onClick={() => navigate("/groups")}>Create Group</p>
          <p onClick={() => navigate("/profile")}>Profile</p>
          <p onClick={() => navigate("/about")}>About</p>
          <p onClick={handleLogout}>Log Out</p>
        </div>
      )}

      {/* Main content */}
      <div className="main-content">
        <h1>Welcome{firstName ? `, ${firstName}` : ""}!</h1>
        <p>Select an option from the menu.</p>
      </div>
    </div>
  );
}

export default Dashboard;
