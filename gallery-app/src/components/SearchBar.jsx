import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  const [tags, setTags] = useState('');

  const submit = e => {
    e.preventDefault();
    const tagsArr = tags.split(',').map(t=>t.trim()).filter(Boolean);
    onSearch(q, tagsArr);
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 20 }}>
      <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
      <input placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
      <button type="submit">Search</button>
    </form>
  );
}
