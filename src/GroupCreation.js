import React, { useState } from 'react';
import './GroupCreation.css';

const GroupCreation = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to create a group.');
      return;
    }

    const groupData = {
      name,
      description,
      subject,
    };

    try {
      const response = await fetch('http://localhost:8000/api/create-group/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Group "${data.group.name}" created successfully!`);
        setName('');
        setDescription('');
        setSubject('');
      } else {
        setError(data.message || 'Failed to create group.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="group-create-wrapper">
      <h2>Create a Study Group</h2>
      <form className="group-form" onSubmit={handleSubmit}>
        <label>Group Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Subject <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />

        <label>Description <span style={{ fontWeight: 'normal', color: '#888' }}>(optional)</span></label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Create Group</button>
      </form>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default GroupCreation;
