import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      navigate('/login');
      return;
    }

    fetch(`http://localhost:8000/api/groups/${groupId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Unexpected content-type. Response: ${text.slice(0, 200)}`);
        }

        return response.json();
      })
      .then((data) => setGroup(data))
      .catch((err) => {
        console.error("Failed to fetch group details:", err.message);
        setError(err.message);
      });
  }, [groupId, navigate]);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!group) {
    return <p>Loading group details...</p>;
  }

  return (
    <div className="group-detail">
      <h2>{group.name}</h2>
      <p><strong>Subject:</strong> {group.subject}</p>
      <p><strong>Description:</strong> {group.description || "No description available."}</p>
      <p><strong>Join Code:</strong> {group.join_code}</p>
      <p><strong>Created by:</strong> {group.creator}</p>
      <p><strong>Members:</strong> {group.members.join(', ')}</p>
      <button onClick={() => navigate('/groups')} className="back-button"> ← Back to Joined Group </button>
    </div>
  );
};

export default GroupDetail;