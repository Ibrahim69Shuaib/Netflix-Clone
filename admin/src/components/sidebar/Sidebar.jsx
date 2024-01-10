import "./Sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  PlayCircleOutline,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
} from "@mui/icons-material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import FilterListIcon from "@mui/icons-material/FilterList";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const handleClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Home" ? "active" : ""
                }`}
                onClick={() => handleClick("Home")}
              >
                <LineStyle className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Users" ? "active" : ""
                }`}
                onClick={() => handleClick("Users")}
              >
                <PermIdentity className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/movies" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Movies" ? "active" : ""
                }`}
                onClick={() => handleClick("Movies")}
              >
                <PlayCircleOutline className="sidebarIcon" />
                Movies
              </li>
            </Link>
            <Link to="/lists" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Lists" ? "active" : ""
                }`}
                onClick={() => handleClick("Lists")}
              >
                <FilterListIcon className="sidebarIcon" />
                Lists
              </li>
            </Link>
            <Link to="/newUser" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Add Users" ? "active" : ""
                }`}
                onClick={() => handleClick("Add Users")}
              >
                <PersonAddIcon className="sidebarIcon" />
                Add Users
              </li>
            </Link>
            <Link to="/newMovie" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Add Movie" ? "active" : ""
                }`}
                onClick={() => handleClick("Add Movie")}
              >
                <LibraryAddIcon className="sidebarIcon" />
                Add Movie
              </li>
            </Link>
            <Link to="/newList" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Add List" ? "active" : ""
                }`}
                onClick={() => handleClick("Add List")}
              >
                <PlaylistAddIcon className="sidebarIcon" />
                Add List
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <Link to="/messages" className="link">
              <li
                className={`sidebarListItem ${
                  activeItem === "Messages" ? "active" : ""
                }`}
                onClick={() => handleClick("Messages")}
              >
                <ChatBubbleOutline className="sidebarIcon" />
                Messages
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
