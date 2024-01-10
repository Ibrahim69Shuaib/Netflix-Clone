import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListItem.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";

export const ListItem = ({ index, item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get("/movies/find/" + item, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  const handlePlayClick = () => {
    navigate({
      pathname: `/watch/${movie._id}`,
    });
  };

  const handleAddToWatchList = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const movieId = movie._id;

      const response = await axios.post(
        "/watchlist/add",
        {
          user_id: userId,
          movie_id: movieId,
        },
        {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        }
      );

      // Display success message
      window.alert(response.data.message);

      console.log(response.data);
    } catch (error) {
      if (error.response) {
        // Request made and server responded with an error
        console.log("Error response", error.response.data.message);
        window.alert(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Request made but no response", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.log("Error", error.message);
      }
    }
  };

  return (
    <div
      className="listItem"
      style={{ left: isHovered ? index * 225 - 50 + index * 2.5 : 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={movie?.imgSm} alt="" />
      {isHovered && (
        <>
          <video src={movie.trailer} autoPlay loop />
          <div className="itemInfo">
            <div className="icons">
              <PlayArrowIcon className="icon" onClick={handlePlayClick} />
              <AddIcon className="icon" onClick={handleAddToWatchList} />
              <ThumbUpOutlinedIcon className="icon" />
              <ThumbDownOutlinedIcon className="icon" />
            </div>
            <div className="itemInfoContent scrollable-content">
              <div className="itemTitle">{movie.title}</div>
              <div className="itemInfoTop">
                <span>{movie.duration}</span>
                <span className="limit">+{movie.limit}</span>
                <span>{movie.year}</span>
                <span className="genre">{movie.genre}</span>
              </div>
              <div className="desc">{movie.desc}</div>
              <div className="dummyDiv"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};