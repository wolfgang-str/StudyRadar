import React, { useState } from 'react';
import GroupDisplay from './GroupDisplay';
import GroupSearchBar from './GroupSearchBar';

const GroupPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div style={{ padding: '20px' }}>
      <GroupSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <GroupDisplay searchQuery={searchQuery} />
    </div>
  );
};

export default GroupPage;