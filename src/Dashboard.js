import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';
import GroupDisplay from './GroupDisplay';

function Dashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Retrieve the first name stored during login
    const storedFirstName = localStorage.getItem('first_name');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="Dashboard">
      <div className="body">
        <img src={logo} className="logo" alt="logo" />
        <h1>Welcome{firstName ? `, ${firstName}` : ''}!</h1>
	<GroupDisplay />
        <form onSubmit={handleSubmit}>
          <button type="submit">Log Out</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
