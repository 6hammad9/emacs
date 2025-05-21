import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import DashboardCard from '../components/homepage/DashboardCard';
import DetailsPopup from '../components/homepage/DetailsPopup';
import { fetchAllCounts, fetchDetails } from '../services/cameraApi';
import NavBar from '../components/NavBar'; // Import NavBar component

const HomePage = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    cameras: 0,
    whitelisted: 0,
    nonWhitelisted: 0,
    unclearPictures: 0
  });
  const [selectedData, setSelectedData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const data = await fetchAllCounts();
        if (data) {
          setCounts(data);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
        setError("Failed to fetch counts.");
      }
    };

    loadCounts();
  }, []); // Empty dependency array to run only once on mount

  const handleCardClick = async (type) => {
    setLoading(true);
    setError('');
    setSelectedData([]); // Reset selected data before fetching

    try {
      const data = await fetchDetails(type);
      setSelectedData(data || []); // Ensure `selectedData` is always an array
      setPopupTitle(
        type === 'nonwhitelisted' ? 'Non-Whitelisted' :
        type === 'unclear' ? 'Unclear Pictures' :
        type.charAt(0).toUpperCase() + type.slice(1)
      );
      setShowPopup(true);
    } catch (err) {
      console.error("Error fetching details:", err);
      setError('Failed to load details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <NavBar /> {/* Add the NavBar component here */}
      
      <div className="dashboard-container">
        <DashboardCard title="Cameras" count={counts.cameras} onClick={() => handleCardClick('cameras')} color="#e3f2fd" />
        <DashboardCard title="Whitelisted" count={counts.whitelisted} onClick={() => handleCardClick('whitelisted')} color="#e8f5e9" />
        <DashboardCard title="Non-Whitelisted" count={counts.nonWhitelisted} onClick={() => handleCardClick('nonwhitelisted')} color="#ffebee" />
        <DashboardCard title="Unclear Pictures" count={counts.unclearPictures} onClick={() => handleCardClick('unclear')} color="#fff3e0" />
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      {showPopup && <DetailsPopup data={selectedData} onClose={() => setShowPopup(false)} title={popupTitle} />}
    </div>
  );
};

export default HomePage;