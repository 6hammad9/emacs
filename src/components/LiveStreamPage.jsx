import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LiveStreamPage.css';

const LiveStreamPage = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/cameras');
      const camerasWithStreams = response.data.map(camera => ({
        ...camera,
        streamUrl: `http://localhost:6033/video_feed/${camera.cam_id}`
      }));
      setCameras(camerasWithStreams);
      setError('');
    } catch (error) {
      console.error('Failed to fetch cameras:', error);
      setError('Failed to load cameras. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-stream-page">
      <h1>Live Camera Feeds</h1>
      {loading ? (
        <p>Loading cameras...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="camera-grid">
          {cameras.map((camera) => (
            <div key={camera._id} className="camera-card">
              <h3>{camera.camera_name}</h3>
              <div className="stream-container">
                <img
                  src={`http://localhost:6033/video_feed/${camera.cam_id}`}
                  alt={`Live feed from ${camera.camera_name}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-camera.jpg';
                  }}
                />
                <div className="camera-info">
                  <p>Camera ID: {camera.cam_id}</p>
                  <p>Department: {camera.department?.dep_name || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveStreamPage;