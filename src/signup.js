import React, { useState } from "react";
import axios from 'axios';
import './signup.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState(""); // First Name field
  const [lastName, setLastName] = useState(""); // Last Name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gradYear, setGradYear] = useState("");  // Add gradYear field
  const [phone, setPhone] = useState("");  // Add phone field
  const [major, setMajor] = useState(""); // Add major field
  const [message, setMessage] = useState("");

    // Email validation regex
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Password strength validation (Ensure password is at least 8 characters long, contains an uppercase letter, and a number)
    const validatePassword = (password) => password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    if (username.length < 3) {
      setMessage("Username must be at least 3 characters long.");
      return;
    }

    if (firstName.length < 2) {
      setMessage("First name must be at least 2 characters long.");
      return;
    }

    if (lastName.length < 2) {
      setMessage("Last name must be at least 2 characters long.");
      return;
    }

    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setMessage(
        "Password must be at least 8 characters long, contain a number and an uppercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!gradYear.match(/^\d{4}$/)) {
      setMessage("Please enter a valid graduation year (e.g., 2025).");
      return;
    }

    if (!phone.match(/^\d{10,15}$/)) {
      setMessage("Please enter a valid phone number (10-15 digits).");
      return;
    }

    if (major.length < 2) {
      setMessage("Major must be at least 2 characters long.");
      return;
    }


    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        username, // Username for login
        first_name: firstName,  
        last_name: lastName,   
        email,
        password,
        grad_year: gradYear,
        phone,
        major,
      });

      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login"; 
      }, 2000);
    } catch (err) {
      setMessage("Sign-up failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Graduation Year"
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
