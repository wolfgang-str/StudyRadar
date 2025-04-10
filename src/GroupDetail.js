import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const token = localStorage.getItem('access_token');
  const currentUser = localStorage.getItem('first_name')?.toLowerCase();

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
      } catch (err) {
        console.error("Failed to fetch group details:", err.message);
        setError(err.message);
      }
    };

    fetchGroupDetails();
  }, [groupId, token]);

  const handleJoin = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/groups/${groupId}/`, 
        { action: "join" },  // payload if needed, adjust as per your backend
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // Update local state so the button is removed.
      setHasJoined(true);
      // Optionally update group members: add current user.
      if (group && currentUser) {
        setGroup({
          ...group,
          members: [...group.members, currentUser]
        });
      }
    } catch (error) {
      console.error("Error joining group:", error.response ? error.response.data : error);
      // No need to display a success message if user has joined; any error will be shown.
      // The backend should return an error if the user is already a member.
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Unknown error"
      );
    }
  };

  if (error) {
    return (
      <p style={{ color: 'red', textAlign: 'center', fontSize: '1rem', marginTop: '20px' }}>
        Error: {error}
      </p>
    );
  }

  if (!group) {
    return (
      <p style={{ textAlign: 'center', fontSize: '1rem', marginTop: '20px' }}>
        Loading group details...
      </p>
    );
  }

  // Determine if the current user is already a member.
  const isMember = group.members.some(
    (member) => member.toLowerCase() === currentUser
  );

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      border: '2px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333'
      }}>
        {group.name}
      </h2>
      <p style={{ margin: '10px 0', fontSize: '1rem', color: '#444' }}>
        <strong>Subject:</strong> {group.subject}
      </p>
      <p style={{ margin: '10px 0', fontSize: '1rem', color: '#444' }}>
        <strong>Description:</strong> {group.description || "No description available."}
      </p>
      <p style={{ margin: '10px 0', fontSize: '1rem', color: '#444' }}>
        <strong>Join Code:</strong> {group.join_code}
      </p>
      <p style={{ margin: '10px 0', fontSize: '1rem', color: '#444' }}>
        <strong>Created by:</strong> {group.creator}
      </p>
      <p style={{ margin: '10px 0', fontSize: '1rem', color: '#444' }}>
        <strong>Members:</strong> {group.members.length > 0 ? group.members.join(', ') : "No members yet."}
      </p>
      
      {!hasJoined && !isMember ? (
        <button
          onClick={handleJoin}
          style={{
            display: 'block',
            margin: '20px auto',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          Join Group
        </button>
      ) : (
        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: 'green',
          margin: '20px 0'
        }}>
          You are already a member of this group.
        </p>
      )}

      <button onClick={() => navigate('/groups')} style={{
        display: 'block',
        margin: '20px auto',
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: '#fff',
        fontSize: '0.9rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        ← Back to Joined Groups
      </button>
    </div>
  );
};

export default GroupDetail;
