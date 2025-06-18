import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
      <video autoPlay loop muted className="hero-video">
        <source src="/videoplayback.mp4" type="video/mp4" />
        Tu navegador no soporta el tag de video.
      </video>
      <div className="hero-text">
        <h1 className="fade-in">SparringLab</h1>
        <p className="fade-in">Entrena como un profesional</p>
      </div>
    </div>
  );
}

export default HeroSection;