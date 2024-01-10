import React, { useContext, useState } from "react";
import { login } from "../../context/authContext/apiCalls";
import { AuthContext } from "../../context/authContext/AuthContext";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email. Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password || password.length < 6) {
      setError(
        "Invalid password. Please enter a password with at least 6 characters."
      );
      return;
    }

    try {
      await login({ email, password }, dispatch);
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="loginContainer">
        <h2 className="projectName">Welcome nullflix admin!</h2>
        <form className="loginForm">
          <input
            type="text"
            placeholder="email"
            className="loginInput"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            className="loginInput"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="loginButton"
            onClick={handleLogin}
            disabled={isFetching}
          >
            Login
          </button>
          {/* {error && <span className="loginError">{error}</span>} */}
        </form>
        {error && (
          <div className="popup">
            <span className="popupText">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
