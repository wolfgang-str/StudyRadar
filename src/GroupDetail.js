import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const currentUser = localStorage.getItem('first_name')?.toLowerCase();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: '', location: '', date: '', time: '', description: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/groups/${groupId}/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setGroup(response.data);
        if (response.data.events) {
          setEvents(response.data.events);
        }
      } catch (err) {
        setError('Failed to fetch group details.');
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  const handleJoin = async () => {
    try {
      await axios.post(`http://localhost:8000/api/groups/${groupId}/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setHasJoined(true);
    } catch (error) {
      setError("Error joining group");
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
  
    const { name, location, date, time } = newEvent;
  
    if (!name || !location || !date || !time) {
      setError("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:8000/api/groups/${groupId}/events/`, newEvent, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEvents([...events, response.data]);
      setNewEvent({ name: '', location: '', date: '', time: '', description: '' });
      setMessage('Event created successfully!');
    } catch (err) {
      setError('Failed to create event.');
    }
  };

  if (!group) return <p>Loading group details...</p>;

  const isMember = group.members.some(member => member.toLowerCase() === currentUser);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>{group.name}</h2>
        <p><strong>Subject:</strong> {group.subject}</p>
        <p><strong>Description:</strong> {group.description}</p>
        <p><strong>Join Code:</strong> {group.join_code}</p>
        <p><strong>Created by:</strong> {group.creator}</p>
        <p><strong>Members:</strong> {group.members.join(', ')}</p>
        {!hasJoined && !isMember ? (
          <button onClick={handleJoin} style={{ margin: '10px 0' }}>Join Group</button>
        ) : (
          <p style={{ color: 'green' }}>You are already a member of this group.</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Group Events</h3>
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} style={{ background: '#f9f9f9', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <h4>{event.name}</h4>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : <p>No events yet.</p>}
      </div>

      {isMember && (
        <div style={{ marginTop: '30px' }}>
          <h3>Create Event</h3>
          <form onSubmit={handleEventSubmit}>
            <input type="text" placeholder="Title" value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} required /><br />
            <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} /><br />
            <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} /><br />
            <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} /><br />
            <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} /><br />
            <button type="submit">Create Event</button>
            {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
            {message && <p style={{ color: 'green', marginTop: '8px' }}>{message}</p>}
          </form>
          {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
      )}

      <button onClick={() => navigate('/groups')} style={{ marginTop: '20px' }}>
        ← Back to Joined Groups
      </button>
    </div>
  );
};

export default GroupDetail;
