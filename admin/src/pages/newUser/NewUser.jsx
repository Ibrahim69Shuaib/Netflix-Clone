import "./newUser.css";
import { useContext, useEffect, useState } from "react";
import { createUser } from "../../context/userContext/apiCalls";
import { UserContext } from "../../context/userContext/UserContext";
import { useNavigate } from "react-router-dom";

export default function NewUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const { dispatch } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(user, dispatch);
    // Check if any field is empty
    if (!user.username || !user.email || !user.password) {
      alert("Please fill in all fields");
      return;
    }
    // Validate email syntax
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      alert("Please enter a valid email address , example : ex@ex.com");
      return;
    }

    // Validate password length
    if (user.password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    // If all validations pass, create user
    createUser(user, dispatch);
    navigate("/users");
  };
  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
        <div className="newUserItem">
          <label>Username</label>
          <input
            value={user.username}
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="john"
          />
        </div>

        <div className="newUserItem">
          <label>Email</label>
          <input
            value={user.email}
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="john@gmail.com"
          />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input
            value={user.password}
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="password"
          />
        </div>

        <div className="newUserItem">
          <label>Is Admin</label>
          <select
            name="isAdmin"
            id="isAdmin"
            value={user.isAdmin}
            onChange={handleChange}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <button className="newUserButton" onClick={handleSubmit}>
          Create
        </button>
      </form>
    </div>
  );
}
