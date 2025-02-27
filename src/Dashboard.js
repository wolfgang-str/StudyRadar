import './Dashboard.css';
import React from 'react';
import logo from './logo.png';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
	e.preventDefault();
	navigate('/');
  }

  return (
    <div className="Dashboard">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
      </header>
	  <div className="body">
	  	<h1> Welcome back, user! </h1>
	  	<form onSubmit={handleSubmit}>
	  		<button type="submit">Log Out</button>
	  	</form>
	  </div>
    </div>
  );
}

export default Dashboard;
