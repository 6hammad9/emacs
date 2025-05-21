import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => navigate('/dashboard')}>Dashboard</li>
        <li onClick={() => navigate('/Gallery')}>Gallery</li>
        <li onClick={() => navigate('/Registerperson')}>Register Person</li>
        <li onClick={() => navigate('/NotWhitelisted')}>Whitelisted</li>
        <li onClick={() => navigate('/CameraInfo')}>Camera Info</li>
        <li onClick={() => navigate('/multistream')}>Multistream</li>
        <li onClick={() => navigate('/LiveStreamPage')}>Live Stream</li>
      </ul>
    </nav>
  );
};

export default NavBar;
