import React, { useEffect, useState } from 'react';
import './GroupDisplay.css';
import { Link } from 'react-router-dom';

const GroupDisplay = ({ searchQuery }) => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const fetchSearchResults = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No auth token found.");
      return;
    }

    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]); // Clear search if too short
      setSearching(false);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`http://localhost:8000/api/search-groups/?q=${trimmed}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error("Failed to fetch search results");
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error.message);
    } finally {
      setSearching(false);
    }
  };

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

      // Refresh joined groups
      fetchStudyGroups();
    } catch (error) {
      console.error("Join group failed:", error.message);
    }
  };

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  return (
<div className="group-wrapper">
  <div className="group-container">

    {/* Show Search Results between search bar and the rest */}
    {searchQuery.trim().length >= 2 && (
      <div className="group-panel">
        <h2>Search Results</h2>
        {searching ? (
          <p>Searching...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((group) => (
            <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
              <div className="group-card clickable search-result">
                <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
                <p><strong>Join Code:</strong> {group.join_code}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>No groups found matching "{searchQuery}"</p>
        )}
      </div>
    )}

    {/* My Joined Groups Section */}
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
        <p>You haven't joined any groups yet.</p>
      )}
    </div>

    {/* Recommended Groups Section */}
    <div className="group-panel recommended-panel">
      <h2>Recommended Groups</h2>
      {recommendations.length > 0 ? (
        recommendations.map((group) => (
          <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
            <div className="group-card clickable recommended">
              <h4>{group.name} <span className="subject-tag">({group.subject})</span></h4>
              <p><strong>Join Code:</strong> {group.join_code}</p>
              <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
            </div>
          </Link>
        ))
      ) : (
        <p>No recommendations available at the moment.</p>
      )}
    </div>

  </div>
</div>
  );
};

export default GroupDisplay;