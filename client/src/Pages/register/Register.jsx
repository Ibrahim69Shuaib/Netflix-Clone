import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email validation error
  const [usernameError, setUsernameError] = useState(""); // State for username error
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const handleStart = () => {
    const enteredEmail = emailRef.current.value;

    // Check if the entered email is valid
    if (!isValidEmail(enteredEmail)) {
      setEmailError("Invalid email address"); // Set the error message
      return;
    }

    setEmailError(""); // Clear the error message
    setEmail(enteredEmail);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    let currentPassword = passwordRef.current.value;
    let currentUsername = usernameRef.current.value;

    try {
      await axios.post("/auth/register", {
        email,
        username: currentUsername,
        password: currentPassword,
      });
      navigate("/login");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data === "Email already exists") {
            setEmailError("Email is already taken");
          } else if (err.response.data === "Username already exists") {
            setUsernameError("Username is already taken");
          } else {
            // Handle other errors
          }
        } else {
          // Handle other errors
        }
      }
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img className="logo" src="/images/Nullflix_Logo.png" alt="" />
          <Link to="/login" className="link">
            <button className="loginButton">Sign In</button>
          </Link>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>Ready to watch? Enter your email to create your account.</p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder="email address" ref={emailRef} />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <form className="input">
            <input type="username" placeholder="username" ref={usernameRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            <button className="registerButton" onClick={handleFinish}>
              Start
            </button>
          </form>
        )}
        {/* Display the email validation error */}
        {emailError && (
          <div style={{ color: "red", marginTop: 10 }}>{emailError}</div>
        )}
        {/* Display the username validation error */}
        {usernameError && (
          <div style={{ color: "red", marginTop: 10 }}>{usernameError}</div>
        )}
      </div>
    </div>
  );
}
