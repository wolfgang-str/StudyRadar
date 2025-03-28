import React from 'react';

const GroupSearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <form onSubmit={handleSearchSubmit}>
        <input
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