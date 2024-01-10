import React, { useState } from "react";
import axios from "axios";
import "./Messages.css";

const Messages = () => {
  const [notification, setNotification] = useState({
    topic: "", // Add topic field
    title: "",
    body: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/notifications/send-notification",
        notification
      );
      if (response.status === 200) {
        // Notification sent successfully
        console.log("Push notification sent!");
      } else {
        // Handle error case
        console.error("Failed to send push notification");
      }
    } catch (error) {
      console.error("Error sending push notification", error);
    }
  };

  return (
    <div className="Messages">
      <h2>New Push Notification</h2>
      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label className="form-label">Topic:</label>
          <input
            type="text"
            name="topic"
            value={notification.topic}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            name="title"
            value={notification.title}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            name="body"
            value={notification.body}
            onChange={handleInputChange}
            className="form-input"
          ></textarea>
        </div>
        <button type="submit" className="submit-button">
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default Messages;
