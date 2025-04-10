import { Link } from "react-router-dom";
import logo from "./components/logo.png";
import React, { useEffect } from 'react';
import './CSS/Aboutus.css';

const About = () => {
  useEffect(() => {
    console.log("About Us page loaded successfully.");
  }, []);

  return (
    <div>
      <div className="App-header">
        <Link to="/login" className="header-link">
          <img src={logo} className="Login-logo" alt="logo" />
        </Link>
        <h1>About Us</h1>
        <p>
          We built this website to help UW-Milwaukee students easily connect and form study groups.
          Our goal is to create a friendly, efficient platform where you can find peers, schedule study sessions, 
          and work together to succeed academically. We believe that learning together makes us all stronger.
        </p>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
        {/* Back to login link */}
        <p style={{ marginTop: "20px" }}>
          <Link to="/login" className="back-link">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
};


export default About;
