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

  // Group + event state
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);

  // // New-event form
  // const [newEvent, setNewEvent] = useState({
  //   name: "",
  //   location: "",
  //   date: "",
  //   time: "",
  //   description: "",
  // });

  // Edit-event form
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEventData, setEditEventData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    description: "",
  });

  // Edit-group form
  const [editingGroup, setEditingGroup] = useState(false);
  const [groupEditData, setGroupEditData] = useState({
    name: "",
    subject: "",
    description: "",
    max_members: "",
  });

  // Feedback
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch group + events
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/groups/${groupId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGroup(data);
        const sortedEvents = (data.events || []).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setEvents(sortedEvents);
      } catch {
        setError("Failed to fetch group details.");
      }
    };
    fetch();
  }, [groupId, token]);

  const handleNewEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setEvents(updatedEvents);
  };

  if (!group) return <p>Loading group details...</p>;

  const isMember = group.members.some(
    (m) => m.toLowerCase() === currentUser
  );
  const isGroupOwner =
    group.creator && group.creator.toLowerCase() === currentUser;

  // — Group Edit Handlers —
  const startGroupEdit = () => {
    setError(null);
    setMessage(null);
    setGroupEditData({
      name: group.name,
      subject: group.subject || "",
      description: group.description || "",
      max_members: group.max_members || "30",
    });
    setEditingGroup(true);
  };

  const cancelGroupEdit = () => {
    setError(null);
    setMessage(null);
    setEditingGroup(false);
  };

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setGroupEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(
        `http://localhost:8000/api/groups/${groupId}/`,
        groupEditData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setGroup((prev) => ({ ...prev, ...groupEditData }));
      setMessage("Group updated successfully!");
      setEditingGroup(false);
    } catch {
      setError("Failed to update group.");
    }
  };

  const handleJoin = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/groups/${groupId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("You have joined the group.");
      setGroup((prev) => ({
        ...prev,
        members: [...prev.members, currentUser],
      }));
    } catch {
      setError("Error joining group");
    }
  };

  const handleLeave = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/groups/${groupId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("You have left the group.");
      setGroup((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.toLowerCase() !== currentUser),
      }));
    } catch {
      setError("Error leaving group");
    }
  };

  const startEdit = (ev) => {
    setError(null);
    setMessage(null);
    setEditingEventId(ev.id);
    setEditEventData({
      name: ev.name,
      location: ev.location,
      date: ev.date,
      time: ev.time,
      description: ev.description || "",
    });
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setError(null);
    setMessage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert empty strings for date/time to null
      const payload = {
        ...editEventData,
        date: editEventData.date || null,
        time: editEventData.time || null,
      };
  
      const { data } = await axios.put(
        `http://localhost:8000/api/groups/${groupId}/events/${editingEventId}/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setEvents((ev) => ev.map((x) => (x.id === editingEventId ? data : x)));
      setMessage("Event updated successfully!");
      setEditingEventId(null);
    } catch {
      setError("Failed to update event.");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/groups/${groupId}/events/${id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents((ev) => ev.filter((x) => x.id !== id));
      setMessage("Event deleted successfully!");
    } catch {
      setError("Failed to delete event.");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      {/* — Group Info & Edit Form — */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {editingGroup ? (
          <form onSubmit={handleGroupSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Group Name"
              value={groupEditData.name}
              onChange={handleGroupChange}
              required
            />
            <br />
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              value={groupEditData.subject}
              onChange={handleGroupChange}
            />
            <br />
            <textarea
              name="description"
              placeholder="Description"
              value={groupEditData.description}
              onChange={handleGroupChange}
            />
            <br />
            <input
              name="max_members"
              type="number"
              min="1"
              placeholder="Max Members"
              value={groupEditData.max_members}
              onChange={handleGroupChange}
            />
            <br />
            <button
              type="submit"
              style={{ marginRight: 8, border: "2px solid black" }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancelGroupEdit}
              style={{ border: "2px solid black" }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h2 style={{ textAlign: "center" }}>{group.name}</h2>
            <p>
              <strong>Subject:</strong> {group.subject}
            </p>
            <p>
              <strong>Description:</strong> {group.description}
            </p>
            <p>
              <strong>Join Code:</strong> {group.join_code}
            </p>
            <p>
              <strong>Created by:</strong> {group.creator}
            </p>
            <p>
              <strong>Members:</strong> {group.members.join(", ")}
            </p>
            {isGroupOwner && (
              <button
                onClick={startGroupEdit}
                style={{ margin: "10px 0", border: "2px solid black" }}
              >
                Edit Group
              </button>
            )}
          </>
        )}

        {/* Join / Leave */}
        {!isMember ? (
          <button style={{ border: "2px solid black" }} onClick={handleJoin}>
            Join Group
          </button>
        ) : (
          <button
            onClick={handleLeave}
            style={{ border: "2px solid black", background: "#e74c3c", color: "#fff" }}
          >
            Leave Group
          </button>
        )}

        {/* Feedback */}
        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
        {message && <p style={{ color: "green", marginTop: 8 }}>{message}</p>}
      </div>

      {/* — Events List & Edit/Delete — */}
      <div style={{ marginTop: 30 }}>
        <h3>Group Events</h3>
        {events.length === 0 && <p>No events yet.</p>}
        {events.map((ev) => (
          <div
            key={ev.id}
            style={{
              background: "#f9f9f9",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
            }}
          >
            {editingEventId !== ev.id ? (
              <>
                <h4>{ev.name}</h4>
                <p>
                  <strong>Date:</strong> {ev.date}
                </p>
                <p>
                  <strong>Time:</strong> {ev.time}
                </p>
                <p>
                  <strong>Location:</strong> {ev.location}
                </p>
                {ev.description && <p>{ev.description}</p>}

                {isGroupOwner && (
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => startEdit(ev)}
                      style={{ marginRight: 8, border: "2px solid black" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      style={{ border: "2px solid black", background: "#e74c3c", color: "#fff" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleEditSubmit} style={{ marginTop: 10 }}>
                <input
                  name="name"
                  type="text"
                  placeholder="Title"
                  value={editEventData.name}
                  onChange={handleEditChange}
                />
                <input
                  name="location"
                  type="text"
                  placeholder="Location"
                  value={editEventData.location}
                  onChange={handleEditChange}
                />
                <br />
                <input
                  name="date"
                  type="date"
                  value={editEventData.date}
                  onChange={handleEditChange}
                />
                <br />
                <input
                  name="time"
                  type="time"
                  value={editEventData.time}
                  onChange={handleEditChange}
                />
                <br />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editEventData.description}
                  onChange={handleEditChange}
                />
                <br />
                <button
                  type="submit"
                  style={{ marginRight: 8, border: "2px solid black" }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{ border: "2px solid black" }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* — Create Event — */}
      {isMember && (
        <div style={{ marginTop: 30 }}>
          <h3>Create Event</h3>
          <EventCreation groupId={groupId} onEventCreated={handleNewEvent} existingEvents={events}/>
        </div>
      )}


      {/* — Back Button — */}
      <button
        onClick={() => navigate("/groups")}
        style={{ marginTop: 20, border: "2px solid black" }}
      >
        ← Back to Joined Groups
      </button>
    </div>
  );
};

export default GroupDetail;
