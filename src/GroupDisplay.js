import React, { useEffect, useState } from 'react';
import './GroupDisplay.css';
import { Link } from 'react-router-dom';

const GroupDisplay = ({ searchQuery }) => {
  const [studyGroups, setStudyGroups] = useState([]); // joined groups
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

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

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed || trimmed.length < 2) {
      setSearching(false);
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8000/api/search-groups/?q=${encodeURIComponent(trimmed)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error(`Search error: ${response.status}`);
        const data = await response.json();

        setSearchResults(data.results);
        setSearching(true);
      } catch (err) {
        console.error("Search failed:", err.message);
        setSearchResults([]);
        setSearching(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleJoinGroup = async (groupId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/join-group/${groupId}/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group");
      }

      fetchStudyGroups();
    } catch (error) {
      console.error("Join group failed:", error.message);
    }
  };

  return (
    <div className="group-wrapper">
      {searching && searchResults.length > 0 && searchQuery.trim().length >= 2 && (
        <div className="group-search-results">
          {searchResults.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
              <div className="group-card clickable">
                <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                <p><strong>Join Code:</strong> {group.join_code}</p>
                <p>{group.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="group-container">
        <div className="group-panel">
          <h2>My Joined Groups</h2>
          {loading ? (
            <p>Loading...</p>
          ) : studyGroups.length > 0 ? (
            studyGroups.map((group) => (
              <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
                <div className="group-card clickable">
                  <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                  <p><strong>Join Code:</strong> {group.join_code}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>You haven’t joined any groups yet.</p>
          )}
        </div>

        <div className="group-panel recommended-panel">
          <h2>Recommended Groups</h2>
          {recommendations.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
              <div className="group-card clickable recommended">
                <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                <p><strong>Join Code:</strong> {group.join_code}</p>
                <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDisplay;
