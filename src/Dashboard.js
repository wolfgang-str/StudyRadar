// Dashboard.js
import React, { useEffect, useState } from "react";

function Dashboard() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) setFirstName(storedFirstName);
  }, []);

  return (
    <>
      <h1>Welcome{firstName ? `, ${firstName}` : ""}!</h1>
      <p>Select an option from the menu.</p>
    </>
  );
}

export default Dashboard;