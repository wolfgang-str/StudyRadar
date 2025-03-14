import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./UserProfile.css"; // Add styles

const UserProfile = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradYear: "",
    major: "",
  });
  const [message, setMessage] = useState("");

  // Fetch user profile from backend
  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Retrieve JWT token
  
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }
  
    axios
      .get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` }, // Add token to headers
        withCredentials: true,
      })
      .then((response) => setUser(response.data))
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load user profile. Please log in again.");
      });
  }, []);


  // Handle form input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    try {
      await axios.put("http://localhost:8000/api/profile/", user, {
        headers: { Authorization: `Bearer ${token}` }, // Attach token
        withCredentials: true,
      });
      setMessage("Profile updated successfully!");

      const response = await axios.get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      setUser(response.data);

    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard"); // Redirects to Dashboard page
    window.location.reload();
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
          disabled
        />
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />
        <input
          type="text"
          name="gradYear"
          value={user.gradYear}
          onChange={handleChange}
        />
        <input
          type="text"
          name="major"
          value={user.major}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>

      <button className="back-button" onClick={goToDashboard}>Back to Dashboard</button>

    </div>
  );
};

export default UserProfile;
