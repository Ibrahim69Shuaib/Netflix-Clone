import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./recolist.scss";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { ListItem } from "../listItem/ListItem";

const Recolist = ({ title }) => {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [clickLimit, setClickLimit] = useState(0);
  const listRef = useRef();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const response = await axios.get(`/watchlist/recommendations/${userId}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        if (response.data) {
          setRecommendedMovies(response.data);
          setClickLimit(Math.ceil(response.data.length / 5));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecommendedMovies();
  }, [userId]);

  const handleClick = (direction) => {
    setIsMoved(true);
    let distance = listRef.current.getBoundingClientRect().x - 50;

    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }

    if (direction === "right" && slideNumber < clickLimit - 1) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  };



 

  return (
    <div className="list">
      <span className="listTitle">{title}</span>
      <div className="wrapper">
        <ArrowBackIosOutlinedIcon
          className="sliderArrow Left"
          onClick={() => handleClick("left")}
          style={{ display: !isMoved && "none" }}
        />
       <div className="container" ref={listRef}>
  {recommendedMovies.slice(slideNumber * 5, slideNumber * 5 + 5).map((movie, index) => (
    <ListItem key={index} index={index} item={movie._id} />
  ))}
</div>
        <ArrowForwardIosOutlinedIcon
          className="sliderArrow Right"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
};

export default Recolist;