import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css"; // Add styles

const UserProfile = () => {
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
    axios
      .get("http://localhost:8000/api/profile/", { withCredentials: true }) // Fetch from backend
      .then((response) => setUser(response.data))
      .catch((error) => setMessage("Failed to load user profile"));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8000/api/profile/", user, {
        withCredentials: true,
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile");
    }
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
    </div>
  );
};

export default UserProfile;
