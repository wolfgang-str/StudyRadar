import './Dashboard.css';
import logo from './logo.png';
import { useState } from "react";
import axios from 'axios';

function Dashboard() {
  return (
    <div className="Dashboard">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
      </header>
	  <div className="body">
	  	<h1> Welcome back, user! </h1>
	  	<div>
	  		<button>Create a new Study Group</button>
	  		<button>Search for a Study Group</button>
	  		<button>View My Study Groups</button>
	  	</div>
	  </div>
    </div>
  );
}

export default Login;
