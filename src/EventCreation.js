import React, { useState } from 'react';
import './EventCreation.css';

const EventCreation = ({ groupId, onEventCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to create an event.');
      return;
    }

    if (!name.trim()) {
      setError('Event name is required.');
      return;
    }

    const eventData = {
      name,
      description,
      date,
      time,
      location,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/groups/${groupId}/create-event/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Event "${data.event.name}" created successfully!`);
        setName('');
        setDescription('');
        setDate('');
        setTime('');
        setLocation('');

        // 🔁 Trigger update in parent
        if (onEventCreated) {
          onEventCreated(data.event);
        }

      } else {
        setError(data.message || 'Failed to create event.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="event-create-wrapper">
      <h2>Create Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <label>Event Title<span className="required-label"> (required)</span></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Location<span className="optional-label"> (optional)</span></label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Date<span className="optional-label"> (optional)</span></label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Time<span className="optional-label"> (optional)</span></label>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Description<span className="optional-label"> (optional)</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Create Event</button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default EventCreation;