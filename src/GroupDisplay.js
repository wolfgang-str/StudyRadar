import React, { useEffect, useState } from 'react';
import './GroupDisplay.css';

const GroupDisplay = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", subject: "" });
  const [message, setMessage] = useState("");

  const fetchStudyGroups = async () => {  
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("No authentication token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/dashboard/', {
        method: 'GET',  
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();

      setStudyGroups(data.study_groups || []);
    } catch (error) {
      console.error('Error fetching study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyGroups(); 
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setMessage("You must be logged in to create a group.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/create-group/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroup)
      });

      if (response.status === 401) {
        setMessage("Session expired. Please log in again.");
        localStorage.removeItem('access_token');
        return;
      }

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setMessage("Study group created successfully!");
      setNewGroup({ name: "", description: "", subject: "" });

      setTimeout(() => fetchStudyGroups(), 100);
    } catch (error) {
      setMessage("Failed to create group: " + error.message);
    }
};

  return (
    <div className="group-display-box">
      <h2>My Study Groups</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {studyGroups.length > 0 ? (
            studyGroups.map((group) => (
              <li key={group.id}>
                <strong>{group.name}</strong> ({group.subject})
                <p>{group.description}</p>
                <p><strong>Join Code:</strong> {group.join_code}</p>
              </li>
            ))
          ) : (
            <p>No study groups available</p>
          )}
        </ul>
      )}

      <h3>Create a New Study Group</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateGroup}>
        <input
          type="text"
          placeholder="Group Name"
          required
          value={newGroup.name}
          onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Subject"
          required
          value={newGroup.subject}
          onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newGroup.description}
          onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
        />
        <button type="submit">Add Group</button>
      </form>
    </div>
  );
};

export default GroupDisplay;