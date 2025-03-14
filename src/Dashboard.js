import "./Dashboard.css";
import React, { useState, useEffect } from "react";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom";
import GroupDisplay from "./GroupDisplay";
import profileIcon from "./profile-icon.png"; 

function Dashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Retrieve the first name stored during login
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear(); // Clear stored user data
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile"); // Navigate to the UserProfile page
  };

  return (
    <div className="Dashboard">
      <div className="body">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <img src={logo} className="logo" alt="logo" />
          <div className="profile-container" onClick={goToProfile}>
            <img src={profileIcon} className="profile-icon" alt="User Profile" />
          </div>
        </div>

        <h1>Welcome{firstName ? `, ${firstName}` : ""}!</h1>
        <GroupDisplay />

        <form onSubmit={handleLogout}>
          <button type="submit">Log Out</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;