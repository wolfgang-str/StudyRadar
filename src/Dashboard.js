// Dashboard.js
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) setFirstName(storedFirstName);
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
        <form onSubmit={handleSubmit}>
          <button type="submit">Log Out</button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;