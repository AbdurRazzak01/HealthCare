// Notification.js
import React from 'react';
import './styles.css'; // Ensure styles for notification are included

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
