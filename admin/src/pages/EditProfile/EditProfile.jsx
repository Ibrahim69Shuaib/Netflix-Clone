import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const fetchMovie = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const { data } = await axios.get(`/users/find/${userId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });

      if (data.message) {
        // setError(response.data.message);
      } else {
        setUser({
          username: data.username,
          email: data.email,
          password: data.password,
          isAdmin: data.isAdmin,
        });
      }
      // setLoading(false);
    } catch (error) {
      // setError("Failed to fetch watchlist");
      // setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovie();
  }, []);

  const [data, setData] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    navigate("/");
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    try {
      const res = await axios.put(`/users/${userId}`, user, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      console.log("res", res);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(user);

  return (
    <div className="newUser">
      <h1 className="newUserTitle">Edit Profile</h1>
      <form className="newUserForm" onSubmit={handleSave}>
        <div className="newUserItem">
          <label>Username</label>
          <input
            value={user.username}
            name="username"
            onChange={handleChange}
            type="text"
          />
        </div>

        <div className="newUserItem">
          <label>Email</label>
          <input
            value={user.email}
            name="email"
            onChange={handleChange}
            type="email"
          />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input
            disabled={true}
            value={user.password}
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="******"
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
        <button className="newUserButton" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
