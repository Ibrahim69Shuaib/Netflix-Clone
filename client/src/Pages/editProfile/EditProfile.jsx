import React, { useState, useEffect } from "react";
import axios from "axios";
import "./editProfile.scss";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend API
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    axios
      .get(`/users/find/${userId}`)
      .then((response) => {
        setUser(response.data);
        setUsername(response.data.username);
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditSuccess(false);
    setPasswordMatchError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    // Prepare the updated user data
    const updatedUser = {
      ...user,
      username,
      password,
      email,
    };

    // Send the updated user data to the backend API
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    axios
      .put(`/users/${userId}`, updatedUser, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      })
      .then((response) => {
        console.log("User data updated successfully:", response.data);
        setEditMode(false);
        setEditSuccess(true);
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="background123">
        <div className="edit-profile-container">
          <h2>Edit Profile</h2>
          {!editMode ? (
            <div className="user-info">
              <div className="info-item">
                <label className="label-text">
                  User Name:
                  <input
                    type="text"
                    value={user.username}
                    disabled
                  />
                </label>
              </div>
              <div className="info-item">
                <label className="label-text">
                  Email:
                  <input
                    type="text"
                    value={user.email}
                    disabled
                  />
                </label>
              </div>
              <button className="edit-button" onClick={handleEdit}>
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="label-text">
                  User Name:
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </label>
              </div>
              <div className="form-group">
                <label htmlFor="password" className="label-text">
                  Password:
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </label>
              </div>
              {editMode && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="label-text">
                    Confirm Password:
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {passwordMatchError && (
                      <p className="error">Passwords do not match</p>
                    )}
                  </label>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email" className="label-text">
                  Email:
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </label>
              </div>
              {editMode && (
                <button type="submit" className="save-button">
                  Save
                </button>
              )}
            </form>
          )}
          {editSuccess && (
            <p className="success">Profile updated successfully</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;