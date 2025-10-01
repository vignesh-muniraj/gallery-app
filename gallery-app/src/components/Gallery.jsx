import React, { useState } from 'react';
import Masonry from 'react-masonry-css';

function ImageCard({ img, currentUser, token, onDeleted, onEdited }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(img.title);
  const [description, setDescription] = useState(img.description);
  const [url, setUrl] = useState(img.url);
  const [tags, setTags] = useState((img.tags || []).join(','));
  const [msg, setMsg] = useState('');

  const isOwner = currentUser && currentUser.id === img.user_id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canEdit = isOwner || isAdmin;
  const canDelete = canEdit;

  const doDelete = async () => {
    if (!token) return alert('Login required');
    if (!window.confirm('Delete this image?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/delete/${img.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.ok) {
        onDeleted && onDeleted();
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const doEdit = async () => {
    if (!token) return alert('Login required');
    try {
      const res = await fetch(`http://localhost:5000/api/edit/${img.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ title, description, url, tags })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Saved');
        setEditing(false);
        onEdited && onEdited();
      } else {
        setMsg(data.error || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      setMsg('Error');
    }
  };

  return (
    <div style={{ position:'relative', borderRadius:8, overflow:'hidden', background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,0.08)' }}>
      <div style={{ position:'relative' }}>
        <img src={img.url} alt={img.title} style={{ width:'100%', display:'block' }} />
        <div style={{ position:'absolute', left:8, top:8, background:'rgba(0,0,0,0.5)', color:'#fff', padding:'2px 6px', borderRadius:4, fontSize:12 }}>
          {img.username || 'unknown'}
        </div>
      </div>

      <div style={{ padding:10 }}>
        {!editing ? (
          <>
            <h3 style={{ margin:'6px 0' }}>{img.title}</h3>
            <p style={{ margin:'6px 0', fontSize:13 }}>{img.description}</p>
            <div style={{ fontSize:12, color:'#666' }}>Tags: {(img.tags || []).join(', ')}</div>
            {(canEdit || canDelete) && (
              <div style={{ marginTop:8 }}>
                {canEdit && <button onClick={()=>setEditing(true)}>Edit</button>}
                {canDelete && <button onClick={doDelete} style={{ marginLeft:8 }}>Delete</button>}
              </div>
            )}
          </>
        ) : (
          <>
            <input value={title} onChange={e=>setTitle(e.target.value)} />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} />
            <input value={url} onChange={e=>setUrl(e.target.value)} />
            <input value={tags} onChange={e=>setTags(e.target.value)} />
            <div style={{ marginTop:6 }}>
              <button onClick={doEdit}>Save</button>
              <button onClick={()=>setEditing(false)} style={{ marginLeft:8 }}>Cancel</button>
            </div>
            {msg && <div style={{ color:'red' }}>{msg}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default function Gallery({ images, token, currentUser, onDeleted, onEdited }) {
  if (!images || images.length === 0) return <p>No images found.</p>;

  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
      style={{ display:'flex', marginLeft:-20, width:'auto' }}
    >
      {images.map(img => (
        <div key={img.id} style={{ padding:20 }}>
          <ImageCard img={img} token={token} currentUser={currentUser} onDeleted={onDeleted} onEdited={onEdited} />
        </div>
      ))}
    </Masonry>
  );
}
