import React, { useContext, useState } from "react";
import "./Topbar.css";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LanguageIcon from "@mui/icons-material/Language";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { loginSuccess } from "../../context/authContext/AuthActions";
import { AuthContext } from "../../context/authContext/AuthContext";
import { Link } from "react-router-dom";
export default function Topbar() {
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [logoutDropdownOpen, setLogoutDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { dispatch } = useContext(AuthContext);

  const handleLanguageDropdownToggle = () => {
    setLanguageDropdownOpen(!languageDropdownOpen);
    setLogoutDropdownOpen(false);
  };

  const handleLogoutDropdownToggle = () => {
    setLogoutDropdownOpen(!logoutDropdownOpen);
    setLanguageDropdownOpen(false);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);
  };

  const handleLogout = () => {
    dispatch(loginSuccess(null));
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin-Nullflix</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <LanguageIcon onClick={handleLanguageDropdownToggle} />
            <span className="topIconBadge">2</span>
            {languageDropdownOpen && (
              <div className="dropdown">
                <ul className="languageList">
                  <li
                    className={selectedLanguage === "English" ? "active" : ""}
                    onClick={() => handleLanguageSelect("English")}
                  >
                    English
                  </li>
                  <li
                    className={selectedLanguage === "Arabic" ? "active" : ""}
                    onClick={() => handleLanguageSelect("Arabic")}
                  >
                    Arabic
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Link to="/EditProfile">
            <img src={"/images/jessie.jpg"} alt="" className="topAvatar" />
          </Link>
          <div
            className="topbarIconContainer"
            onClick={handleLogoutDropdownToggle}
          >
            {logoutDropdownOpen ? <ArrowDropUp /> : <ArrowDropDown />}
            {logoutDropdownOpen && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
