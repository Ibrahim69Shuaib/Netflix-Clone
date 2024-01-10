import React, { useState, useContext } from "react";
import { AuthContext } from "../../authContext/AuthContext";
import { logout } from "../../authContext/AuthActions";
import "./Navbar.scss";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Link } from "react-router-dom";
import MovieSearch from "../MovieSearch/MovieSearch"; // Assuming 'MovieSearch.js' is in the same directory
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HistoryIcon from "@mui/icons-material/History";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { dispatch } = useContext(AuthContext);
  window.onscroll = () => {
    setIsScrolled(window.scrollY === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <Link to="/" className="link">
            <img src="/images/Nullflix_Logo.png" alt="" />
          </Link>
          <Link to="/" className="link">
            <span>Homepage</span>
          </Link>
          <Link to="/series" className="link">
            <span>Series</span>
          </Link>
          <Link to="/movies" className="link">
            <span>Movies</span>
          </Link>
          <Link to="/browse" className="link">
            <span>Browse All</span>
          </Link>
          <Link to="/watchList" className="link">
            <span>My Watch List</span>
          </Link>
        </div>
        <div className="right">
          <MovieSearch />
          <Link to="/history" className="link hover-red">
            <HistoryIcon className="hover-red" />
          </Link>
          <NotificationsIcon className="icon hover-red" />
          <Link to="/editprofile" className="link">
            <AccountCircleIcon className="hover-red" />
          </Link>
          <div className="profile">
            <ArrowDownwardIcon className="icon" />
            <div className="options">
              <span>Settings</span>
              <span onClick={() => dispatch(logout())}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
