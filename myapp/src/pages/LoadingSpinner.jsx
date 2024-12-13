// LoadingSpinner.js
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './LoadingSpinner.css'; // Create this CSS file for styling

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <CircularProgress />
    </div>
  );
};

export default LoadingSpinner;
