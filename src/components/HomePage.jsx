import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'
const HomePage = () => {
  const [totalCameras, setTotalCameras] = useState(0);
  const navigate = useNavigate();  // For navigating to login page if not authenticated

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login page if not logged in
    } else {
      fetchCameraData();  // Fetch camera data if authenticated
    }
  }, [navigate]);

  // Fetch camera count from the database
  const fetchCameraData = async () => {
    try {
      const response = await axios.get('/api/cameras/count', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include token in header
        }
      });
      setTotalCameras(response.data.count);  // Assuming the API returns { count: number }
    } catch (error) {
      console.error('Error fetching camera data:', error);
    }
  };

  return (
    <div className="home-page">
      <div className="camera-card">
        <div className="card">
          <div className="card-content">
            <div className="card-body">
              <h5>Cameras</h5>
              <div className="camera-count">
                <p>Total Cameras: {totalCameras}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
