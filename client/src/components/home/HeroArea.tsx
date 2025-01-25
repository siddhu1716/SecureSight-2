import React from 'react';
import { motion } from 'framer-motion';
import './HeroArea.css';

const HeroArea = () => {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="title-wrapper">
            <img 
              src="/assets/images/logo.png" 
              alt="SecureSight Logo" 
              className="hero-logo"
            />
            <h1 className="title">
              <span className="secure-text">Secure</span>
              <span className="sight-text">Sight</span>
              <span className="version-text">2.0</span>
            </h1>
          </div>
          
          <p className="hero-subtitle">
            Empowering Safety Through Every Frame: Real-Time AI Security Solutions
          </p>
          
          <div className="cta-section">
            <p className="collaborate-text">Ready to collaborate?</p>
            <div className="input-wrapper">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="email-input"
              />
              <button className="join-button">Join Waitlist →</button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="video-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/QXfusN_adIE?autoplay=1&mute=1"
              title="SecureSight Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroArea;
