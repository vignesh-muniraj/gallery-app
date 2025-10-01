import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ImageUploadForm from './components/ImageUploadForm';
import SearchBar from './components/SearchBar';
import Gallery from './components/Gallery';

function App() {
  const [images, setImages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState([]);

  const fetchImages = async (q = '', tagsArr = []) => {
    try {
      let url = 'http://localhost:5000/api/images';
      const params = [];
      if (q) params.push(`q=${encodeURIComponent(q)}`);
      if (tagsArr.length) params.push(`tags=${tagsArr.map(t => encodeURIComponent(t)).join(',')}`);
      if (params.length) url += '?' + params.join('&');

      const res = await fetch(url);
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleLogin = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const onSearch = (q, tagsArr) => {
    setQuery(q);
    setTags(tagsArr);
    fetchImages(q, tagsArr);
  };

  const onUploadSuccess = () => {
    fetchImages(query, tags);
  };

  return (
    <div style={{ padding: '20px', maxWidth: 1100, margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Modern Gallery</h1>
        {user ? (
          <div>
            Hello {user.username} ({user.role}) <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </header>

      <ImageUploadForm token={token} onUploadSuccess={onUploadSuccess} />
      <SearchBar onSearch={onSearch} />
      <Gallery
        images={images}
        token={token}
        currentUser={user}
        onDeleted={() => fetchImages(query, tags)}
        onEdited={() => fetchImages(query, tags)}
      />
    </div>
  );
}

export default App;
