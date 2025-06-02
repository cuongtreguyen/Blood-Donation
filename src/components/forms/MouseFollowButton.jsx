import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './button.css';

const MouseFollowButton = () => {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty('--mouse-x', `${x}%`);
    button.style.setProperty('--mouse-y', `${y}%`);
  };

  const handleMouseLeave = () => {
    const button = buttonRef.current;
    button.style.setProperty('--mouse-x', '50%');
    button.style.setProperty('--mouse-y', '50%');
  };

  return (
    <div className="button-container">
      <Link to="/">
        <button
          className="glow-button"
          ref={buttonRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <span className="button-text">
            <span className="arrow">←</span> trang chủ
          </span>
        </button>
      </Link>
    </div>
  );
};

export default MouseFollowButton;
