import { React, useRef, useState } from 'react';

/*
const fullGroups = StudyGroup.Objects.all();

const filterByName = (searchQuery) => {
  if (searchQuery === "") {
    return fullGroups;
  }
  return fullGroups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));
}

const filterBySubject = (searchQuery) => {
  if (searchQuery === "") {
    return fullGroups;
  }
  return fullGroups.filter((group) => group.subject.toLowerCase().includes(searchQuery.toLowerCase()));
}

const filterByDesc = (searchQuery) => {
  if (searchQuery === "") {
    return fullGroups;
  }
  return fullGroups.filter((group) => group.description.toLowerCase().includes(searchQuery.toLowerCase()));
}
  */



const GroupSearchBar = ({ searchQuery, setSearchQuery }) => {
  const query = useRef();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to fetch from the database.');
      return;
    }

    const groupData = {
      name: 
    }

    const fetchGroups = async (query) => {
      try {
        const response = await fetch('http://localhost:8000/api', //query goes in here somewhere...?
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: 
          }
        );
  
        const data = await response.json();
        if (response.ok) {
          setGroups = [...response.data];
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }


    }

      const queryVal = query.current.value;
      fetchGroups(queryVal.trim());
    };


    return (
      <div style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSearchSubmit}>
          <input
            ref={query}
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    );
  };

  export default GroupSearchBar;