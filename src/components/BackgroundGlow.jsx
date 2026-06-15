import React from 'react';
import './BackgroundGlow.css';

const BackgroundGlow = () => {
  return (
    <div className="bg-glow-container">
      <div className="glow-orb purple-orb"></div>
      <div className="glow-orb blue-orb"></div>
      <div className="noise-overlay"></div>
    </div>
  );
};

export default BackgroundGlow;
