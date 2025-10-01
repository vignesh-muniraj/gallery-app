import React, { useState } from 'react';

export default function ImageUploadForm({ token, onUploadSuccess }) {
  const [mode, setMode] = useState('file'); // 'file' or 'link'
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage('Login required');

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean).join(',');

    try {
      let res, data;
      if (mode === 'file') {
        if (!file) return setMessage('Select file');

        const form = new FormData();
        form.append('file', file);
        form.append('title', title);
        form.append('description', description);
        form.append('tags', tags);

        res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token },
          body: form
        });
        data = await res.json();
      } else {
        if (!url) return setMessage('Provide URL');
        res = await fetch('http://localhost:5000/api/upload_link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ title, description, url, tags })
        });
        data = await res.json();
      }

      if (res.ok) {
        setMessage('Uploaded');
        setFile(null); setUrl(''); setTitle(''); setDescription(''); setTagsStr('');
        onUploadSuccess && onUploadSuccess();
      } else {
        setMessage(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Upload error');
    }
  };

  return (
    <form onSubmit={submit} style={{ margin: '20px 0' }}>
      <div>
        <label><input type="radio" checked={mode==='file'} onChange={()=>setMode('file')} /> File</label>
        <label style={{marginLeft:12}}><input type="radio" checked={mode==='link'} onChange={()=>setMode('link')} /> Link</label>
      </div>

      {mode === 'file' ? (
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      ) : (
        <input type="text" placeholder="Image URL" value={url} onChange={e=>setUrl(e.target.value)} style={{width:'60%'}} />
      )}

      <div>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
      </div>
      <div>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
      </div>
      <div>
        <input value={tagsStr} onChange={e=>setTagsStr(e.target.value)} placeholder="Tags (comma separated)" />
      </div>

      <button type="submit">{mode==='file' ? 'Upload' : 'Save Link'}</button>
      {message && <div style={{color:'red'}}>{message}</div>}
    </form>
  );
}
