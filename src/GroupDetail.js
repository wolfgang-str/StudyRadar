import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    fetch(`/api/groups/${groupId}`)
      .then((response) => response.json())
      .then((data) => setGroup(data));
  }, [groupId]);

  if (!group) {
    return <p>Loading group details...</p>;
  }

  return (
    <div className="group-detail">
      <h2>{group.name}</h2>
      <p><strong>Subject:</strong> {group.subject}</p>
      <p><strong>Description:</strong> {group.description || "No description available."}</p>
      <p><strong>Join Code:</strong> {group.join_code}</p>
      <p><strong>Members:</strong> {group.members.join(', ')}</p>
    </div>
  );
};

export default GroupDetail;

