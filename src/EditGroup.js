import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditGroup = () => {
  const { groupId } = useParams();
  const navigate        = useNavigate();
  const token           = localStorage.getItem('access_token');

  const [form, setForm]       = useState({
    name: '',
    description: '',
    subject: '',
    max_members: 30,
  });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing group details
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/groups/${groupId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm({
          name:        data.name,
          description: data.description || '',
          subject:     data.subject || '',
          max_members: data.max_members,
        });
      } catch (err) {
        setError('Failed to load group. Are you the creator?');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.put(
        `http://localhost:8000/api/edit-group/${groupId}/`,
        form,
        { headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type':'application/json'
        }}
      );
      // On success, go back to detail page
      navigate(`/group/${groupId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Edit Study Group</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Group Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <br />

        <label>
          Subject
          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Max Members
          <input
            type="number"
            name="max_members"
            value={form.max_members}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
        <br />

        <button type="submit" style={{ marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditGroup;
