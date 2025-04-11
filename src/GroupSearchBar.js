import React from 'react';
import './GroupSearchBar.css';

const GroupSearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="search-bar-wrapper">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          className="search-input"
          placeholder="Search groups by name or keyword"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </form>
    </div>
  );
};

export default GroupSearchBar;