import React, { useState } from 'react';
import './EventCreation.css';

const EventCreation = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
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

    const groupData = {
      name,
      description,
      subject,
    };

    try {
      const response = await fetch('http://localhost:8000/api/create-event/', {
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
        setSubject('');
      } else {
        setError(data.message || 'Failed to create event.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="event-create-wrapper">
      <h2>Create an event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <label>Event Title </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Location <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <input type="text" value={location} onChange={(e) => setSubject(e.target.value)} />

        <label>Date <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <textarea value={date} onChange={(e) => setDescription(e.target.value)} />
        
	<label>Time <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <textarea value={time} onChange={(e) => setDescription(e.target.value)} />

        <label>Description <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Create Group</button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default EventCreation;
