import React, { useState } from 'react';
import GroupSearchBar from './GroupSearchBar';
import GroupDisplay from './GroupDisplay';
import './GroupPage.css';

const GroupPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="group-page-wrapper">
      <div className="group-search-wrapper">
        <GroupSearchBar setSearchQuery={setSearchQuery} />
      </div>

      <div className="group-display-wrapper">
        <GroupDisplay searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default GroupPage;