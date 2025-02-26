import './Dashboard.css';
import logo from './logo.png';
import { useState } from "react";
import axios from 'axios';

function Dashboard() {
  return (
    <div className="Dashboard">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
	<h1> Welcome back, user! </h1>
      </header>
    </div>
  );
}

export default Login;
