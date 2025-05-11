import React, { useState } from "react";
import axios from 'axios';
import './signup.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [phone, setPhone] = useState("");
  const [major, setMajor] = useState("");
  const [customMajor, setCustomMajor] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters long.");
      setMessageType("error");
      return;
    }

    if (firstName.length < 2) {
      setMessage("First name must be at least 2 characters long.");
      setMessageType("error");
      return;
    }

    if (lastName.length < 2) {
      setMessage("Last name must be at least 2 characters long.");
      setMessageType("error");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (!validatePassword(password)) {
      setMessage("Password must be at least 8 characters long, contain a number and an uppercase letter.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    if (gradYear && !gradYear.match(/^\d{4}$/)) {
      setMessage("Please enter a valid graduation year (e.g., 2025).");
      setMessageType("error");
      return;
    }

    if (phone && !phone.match(/^\d{10,15}$/)) {
      setMessage("Please enter a valid phone number (10-15 digits).");
      setMessageType("error");
      return;
    }

    const finalMajor = major === "Other" ? customMajor : major;

    if (!finalMajor || finalMajor.length < 2) {
      setMessage("Please enter a valid major.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        grad_year: gradYear,
        phone,
        major: finalMajor,
      });

      setMessage("Account created successfully");
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      setMessage("Sign-up failed: " + (err.response?.data?.message || "Unknown error"));
      setMessageType("error");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {message && <p className={`message ${messageType === "success" ? "success" : ""}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <input type="text" placeholder="Graduation Year (optional)" value={gradYear} onChange={(e) => setGradYear(e.target.value)} />
        <input type="text" placeholder="Phone Number (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <div>
          <label htmlFor="major">Select Major:</label>
          <select value={major} onChange={(e) => setMajor(e.target.value)} required>
            <option value="">-- Select Major --</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Engineering">Engineering</option>
            <option value="Biology">Biology</option>
            <option value="Psychology">Psychology</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {major === "Other" && (
          <div className="custom-major-wrapper">
            <label htmlFor="customMajor">Enter your major:</label>
            <input type="text" id="customMajor" placeholder="Your Major" value={customMajor} onChange={(e) => setCustomMajor(e.target.value)} required />
          </div>
        )}

        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default SignUp;