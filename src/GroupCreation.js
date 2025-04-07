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

// This is a React component for creating a study group.

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import logo from './logo.png';
// import './GroupCreation.css';

// const GroupCreation = () => {
//   const [className, setClassName] = useState('');
//   const [location, setLocation] = useState('');
//   const [meetingStart, setMeetingStart] = useState('');
//   const [meetingEnd, setMeetingEnd] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       className,
//       location,
//       meetingStart,
//       meetingEnd,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/create-group/",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       setMessage("Group created successfully!");
//       // Optionally, clear the form or navigate away.
//     } catch (error) {
//       console.error("Error creating group:", error.response ? error.response.data : error);
//       setMessage("Error creating group: " + (error.response ? error.response.data.message : "Unknown error"));
//     }
//   };

//   return (
//     <div className="group-creation-container">
//       <header className="group-creation-header">
//         <Link to="/dashboard" className="header-link">
//           <img src={logo} className="Login-logo" alt="logo" />
//         </Link>
//       </header>
//       <h1>Create a Study Group</h1>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="className">Class</label>
//         <input
//           type="text"
//           id="className"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           placeholder="Enter class name or number"
//           required
//         />

//         <label htmlFor="location">Meeting Location</label>
//         <input
//           type="text"
//           id="location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           placeholder="Enter meeting location"
//           required
//         />

//         <label htmlFor="meetingStart">Meeting Start</label>
//         <input
//           type="datetime-local"
//           id="meetingStart"
//           value={meetingStart}
//           onChange={(e) => setMeetingStart(e.target.value)}
//           required
//         />

//         <label htmlFor="meetingEnd">Meeting End</label>
//         <input
//           type="datetime-local"
//           id="meetingEnd"
//           value={meetingEnd}
//           onChange={(e) => setMeetingEnd(e.target.value)}
//           required
//         />

//         <button type="submit">Create Group</button>
//       </form>
//       {message && <p className="success-message">{message}</p>}
//     </div>
//   );
// };

// export default GroupCreation;
