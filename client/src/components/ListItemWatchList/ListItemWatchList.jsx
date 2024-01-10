import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListItem.scss";

export const ListItemWatchList = ({ movie }) => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate(`/watch/${movie._id}`);
  };

  const handleAddToWatchList = async () => {
    // Implement your logic to add the movie to the watchlist
  };

  return (
    <div className="listItem">
      <img src={movie.img} alt={movie.title} />
      <div className="itemInfo">
        <div className="icons">
          <div className="icon" onClick={handlePlayClick}>
            Play
          </div>
          <div className="icon" onClick={handleAddToWatchList}>
            Add to Watchlist
          </div>
        </div>
        <div className="itemInfoTop">
          <span>{movie.duration}</span>
          <span className="limit">+{movie.limit}</span>
          <span>{movie.year}</span>
        </div>
        <div className="desc">{movie.desc}</div>
        <div className="genre">{movie.genre}</div>
      </div>
    </div>
  );
};
