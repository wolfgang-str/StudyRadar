import React from 'react';

const filterByName = (searchQuery) => {
  const fullGroups = StudyGroup.Objects.all();
  if (searchQuery === "") {
    return fullGroups;
  }
  return fullGroups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase()));
}

const GroupSearchBar = ({ searchQuery, setSearchQuery }) => {
  const query = useRef();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  emptyState = {
    groups: [],
    startIndex: 0,
    progress: 0
  }

  const [searchState, setSearchState] = useState(emptyState);

  const fetchGroups = (query) => {
    fetch('http://localhost:8000/api/groups/') //query goes in here somewhere...?
      .then((res) => res.json())
      .then((data) => {
        setSearchState({
          groups: data,
          progress: 0,
          startIndex: 0
        })
      })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();
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