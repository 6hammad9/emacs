// src/components/homepage/DetailsPopup.js
import React from 'react';
import '/src/styles/HomePage.css';

const DetailsPopup = ({ data, onClose, title }) => {
  // Ensure `data` is always an array, even if it's undefined or null
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{title} Details</h2>
        <div className="details-list">
          {safeData.length > 0 ? (
            safeData.map((item, index) => (
              <div key={index} className="detail-item">
                {title === 'Cameras' && (
                  <>
                    <p>Camera ID: {item.cam_id}</p>
                    <p>Name: {item.camera_name}</p>
                    <p>Department: {item.department?.name}</p>
                    <p>Last Active: {new Date(item.datetime).toLocaleString()}</p>
                  </>
                )}

                {title === 'Whitelisted' && (
                  <>
                    <p>Name: {item.name}</p>
                    <p>Status: {item.status}</p>
                    <p>Last Seen: {new Date(item.datetime).toLocaleString()}</p>
                  </>
                )}

                {title === 'Non-Whitelisted' && (
                  <>
                    <p>Detection Date: {new Date(item.datetime).toLocaleString()}</p>
                    <p>Camera: {item.cam}</p>
                    <p>Location: {item.department_area?.area_name}</p>
                  </>
                )}

                {title === 'Unclear Pictures' && (
                  <>
                    <p>Detection Date: {new Date(item.datetime).toLocaleString()}</p>
                    <p>Camera: {item.cam}</p>
                    <p>Reason: {item.reason || 'Low quality image'}</p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No data available for {title}.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;