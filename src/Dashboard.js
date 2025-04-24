import React, { useEffect, useState } from "react";
import axios from "axios";
import "./upcomingEvents.css"; 

function Dashboard() {
  const [firstName, setFirstName] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) setFirstName(storedFirstName);

    const token = localStorage.getItem("access_token");

    axios.get("http://localhost:8000/api/events/upcoming/", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      console.log("📦 Response from /events/upcoming:", res.data);
      setEvents(res.data.upcoming_events || []);
    })
    .catch((err) => {
      console.error("Failed to fetch upcoming events", err);
    });
  }, []);

  return (
    <div>
      <h1>Welcome{firstName ? `, ${firstName}` : ""}!</h1>
      <p>Select an option from the menu.</p>

      {events.length > 0 ? (
        <div className="event-section">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Upcoming Events</h2>
          <div className="event-grid">
            {events.map((event) => (
              <div className="event-card" key={event.id}>
                <h3>{event.name}</h3>
                <p><strong>Group:</strong> {event.group_name}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Time:</strong> {event.time}</p>
                <p><strong>Location:</strong> {event.location}</p>
                {event.description && <p>{event.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color: "red", marginTop: "30px" }}>No events to show (events.length = {events.length})</p>
      )}
    </div>
  );
}

export default Dashboard;