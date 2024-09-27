import React, { useEffect } from 'react';
import './styles.css'; // Ensure styles for notification are included

const Notification = ({ message, onClose, type = 'info', duration = 5000 }) => {
  
  // Auto-close the notification after a duration
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [onClose, duration]);

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
      <button onClick={onClose} className="notification-close">
        &times;
      </button>
    </div>
  );
};

export default Notification;
