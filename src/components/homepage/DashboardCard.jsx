// src/components/homepage/DashboardCard.js
import React from 'react';
import '/src/styles/HomePage.css';

const DashboardCard = ({ title, count, onClick, color }) => {
  return (
    <div className="dashboard-card" onClick={onClick} style={{ backgroundColor: color }}>
      <h3>{title}</h3>
      <div className="card-count">
        <span>{count}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
