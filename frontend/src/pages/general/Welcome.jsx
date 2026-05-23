import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/welcome.css';

const Welcome = () => {
  return (
    <main className="welcome-page">
      <div className="welcome-panel welcome-copy">
        {/* <div className=""> */}
          <p className="eyebrow">Welcome to</p>
          <h1>REELBITE</h1>
          <p className="welcome-description">
            Discover delicious food stories, manage your restaurant business, and keep everything in one place.
          </p>
          <div className="welcome-actions">
            <Link to="/user/login" className="welcome-button welcome-button-primary">
              User Login
            </Link>
            <Link to="/food-partner/login" className="welcome-button">
              Partner Login
            </Link>
            <Link to="/admin/pending-partners" className="welcome-button welcome-button-secondary">
              Admin Login
            </Link>
          </div>
        {/* </div> */}
      </div>
    </main>
  );
};

export default Welcome;
