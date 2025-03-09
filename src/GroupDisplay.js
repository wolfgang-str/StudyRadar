import React, { useEffect, useState } from 'react';
import './GroupDisplay.css';

const GroupDisplay = () => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch('https://') //I dont know what our endpoint is rn
      .then(response => response.json())
      .then(data => {
        setStudyGroups(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching study groups:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="group-display-box">
      <h2>Study Groups</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {studyGroups.length > 0 ? (
            studyGroups.map((group) => (
              <li key={group.id}>{group.name}</li> // i dont know what our end point is
            ))
          ) : (
            <p>No study groups available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default GroupDisplay;

