import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EventCreation from "./EventCreation";
import "./EventCreation.css";

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const currentUser = localStorage.getItem("first_name")?.toLowerCase();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/groups/${groupId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setGroup(response.data);
        if (response.data.events) {
          const sortedEvents = [...response.data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
          setEvents(sortedEvents);
        }
      } catch (err) {
        setError("Failed to fetch group details.");
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  const handleJoin = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/groups/${groupId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setHasJoined(true);
    } catch (error) {
      setError("Error joining group");
    }
  };

  const handleNewEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(updatedEvents);
  };

  if (!group) return <p>Loading group details...</p>;

  const isMember = group.members.some(
    (member) => member.toLowerCase() === currentUser
  );

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>{group.name}</h2>
        <p><strong>Subject:</strong> {group.subject}</p>
        <p><strong>Description:</strong> {group.description}</p>
        <p><strong>Join Code:</strong> {group.join_code}</p>
        <p><strong>Created by:</strong> {group.creator}</p>
        <p><strong>Members:</strong> {group.members.join(", ")}</p>
        {!hasJoined && !isMember ? (
          <button onClick={handleJoin} style={{ margin: "10px 0" }}>
            Join Group
          </button>
        ) : (
          <p style={{ color: "green" }}>You are already a member of this group.</p>
        )}
      </div>

      <div className="event-wrapper-card">
        <h2 className="event-title">Group Events</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              {event.description && (
                <p style={{ marginTop: "12px", color: "#666" }}>{event.description}</p>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>No events yet.</p>
        )}

        <button onClick={() => navigate("/groups")} style={{ marginTop: "20px" }}>
          ← Back to Joined Groups
        </button>
      </div>

      {isMember && (
        <div style={{ marginTop: "30px" }}>
          <h3>Create Event</h3>
          <EventCreation groupId={groupId} onEventCreated={handleNewEvent} />
        </div>
      )}
    </div>
  );
};

export default GroupDetail;