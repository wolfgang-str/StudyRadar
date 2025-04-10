import React, { useEffect, useState } from 'react';
import './GroupDisplay.css';
import { Link } from 'react-router-dom';

const GroupDisplay = ({ searchQuery }) => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching study groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  const filteredGroups = studyGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="group-wrapper">
      <div className="group-container">
        <div className="group-panel">
          <h2>My Joined Groups</h2>
          {loading ? (
            <p>Loading...</p>
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
                <div className="group-card clickable">
                  <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                  <p><strong>Join Code:</strong> {group.join_code}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No matching groups found.</p>
          )}
        </div>
  
        <div className="group-panel recommended-panel">
          <h2>Recommended Groups</h2>
          {recommendations.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
              <div className="group-card clickable recommended">
                <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                <p><strong>Join Code:</strong> {group.join_code}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDisplay;