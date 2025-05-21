import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Gallery.css';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setError('');

    try {
      // Temporary placeholder images (remove when backend is ready)
      setImages([
        { url: "https://via.placeholder.com/150", name: "Placeholder 1" },
        { url: "https://via.placeholder.com/150", name: "Placeholder 2" },
        { url: "https://via.placeholder.com/150", name: "Placeholder 3" }
      ]);
    } catch (error) {
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery">
      <h1>Gallery</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="image-grid">
          {images.map((image, index) => (
            <div key={index} className="image-card">
              <img src={image.url} alt={image.name} />
              <p>{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;