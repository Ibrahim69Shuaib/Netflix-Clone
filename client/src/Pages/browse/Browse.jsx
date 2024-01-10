import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import "./browse.scss";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("/movies", {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });
        setMovies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  const handlePlayClick = (movieId) => {
    navigate(`/watch/${movieId}`);
  };

  return (
    <>
      <Navbar />
      <div className="browse-page">
        {movies.map((movie) => (
          <div
            key={movie._id}
            className="movie-card-1"
            onClick={() => handlePlayClick(movie._id)}
          >
            <div
              className="movie-image"
              style={{ backgroundImage: `url(${movie.img})` }}
            ></div>
            <div className="movie-details">
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-info">
                <span className="duration">{movie.duration}</span>
                <span className="limit">+{movie.limit}</span>
                <span className="year">{movie.year}</span>
                <span className="genre">{movie.genre}</span>
              </div>
              <p className="movie-description">{movie.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Browse;
