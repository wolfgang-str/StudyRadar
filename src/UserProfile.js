import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

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
    newPassword: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  const validateGradYear = (year) => !year || /^\d{4}$/.test(year);
  const validatePhone = (phone) => !phone || /^\d{10,15}$/.test(phone);
  const validateName = (name) => name.length >= 2;
  const validateUsername = (username) => username.length >= 3;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }
    axios
      .get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        setUser((prevUser) => ({
          ...prevUser,
          ...response.data,
          newPassword: "",
          confirmPassword: ""
        }));
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setMessage("Failed to load user profile. Please log in again.");
      });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    if (!validateUsername(user.username)) {
      setMessage("Username must be at least 3 characters long.");
      return;
    }
    if (!validateName(user.firstName)) {
      setMessage("First name must be at least 2 characters long.");
      return;
    }
    if (!validateName(user.lastName)) {
      setMessage("Last name must be at least 2 characters long.");
      return;
    }
    if (!validateEmail(user.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!validateGradYear(user.gradYear)) {
      setMessage("Graduation year must be 4 digits (e.g., 2025). Leave blank if not applicable.");
      return;
    }
    if (!validatePhone(user.phone)) {
      setMessage("Phone number must be 10-15 digits. Leave blank if not applicable.");
      return;
    }
    if (!user.major || user.major.length < 2) {
      setMessage("Please enter a valid major.");
      return;
    }
    if (user.newPassword || user.confirmPassword) {
      if (user.newPassword !== user.confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
      if (!validatePassword(user.newPassword)) {
        setMessage("Password must be at least 8 characters long, contain a number and an uppercase letter.");
        return;
      }
    }

    try {
      await axios.put("http://localhost:8000/api/profile/", user, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessage("Profile updated successfully!");
      setUser((prevUser) => ({
        ...prevUser,
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to update profile");
      }
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {message && (
        <p className={`message ${message.toLowerCase().includes("successfully") ? "success" : "error"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={user.username} onChange={handleChange} disabled />
        <input type="text" name="firstName" value={user.firstName} onChange={handleChange} required />
        <input type="text" name="lastName" value={user.lastName} onChange={handleChange} required />
        <input type="email" name="email" value={user.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone Number (optional)" value={user.phone} onChange={handleChange} />
        <input type="text" name="gradYear" placeholder="Graduation Year (optional)" value={user.gradYear} onChange={handleChange} />
        <input type="text" name="major" value={user.major} onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="New Password" value={user.newPassword} onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={user.confirmPassword} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
      <button className="back-button" onClick={goToDashboard}>Back to Dashboard</button>
    </div>
  );
};

export default UserProfile;
