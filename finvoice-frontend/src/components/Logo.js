import React from 'react';

function Logo({ size = 'medium', showText = true }) {
  const sizes = {
    small: { img: 24, text: '16px' },
    medium: { img: 40, text: '24px' },
    large: { img: 60, text: '32px' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`logo-container logo-${size}`}>
      <img 
        src="/logo.jpg" 
        alt="FinVoiceAI" 
        className="logo-img"
        style={{ height: currentSize.img, width: 'auto' }}
      />
      {showText && (
        <h1 style={{ fontSize: currentSize.text, margin: 0 }}>
          FinVoiceAI
        </h1>
      )}
    </div>
  );
}

export default Logo;