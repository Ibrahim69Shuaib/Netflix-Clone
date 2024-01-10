import React, { useState, useEffect } from "react";
import axios from "axios";
import "./watchList.scss";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";

const Watchlist = ({ userId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      try {
        const response = await axios.get(`/watchlist/${userId}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          setMovies([]); // Set movies to an empty array if the response data is not an array
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch watchlist");
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [userId]);

  const handleDeleteMovie = async (movieId) => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    try {
      await axios.delete(`/watchlist/${userId}/${movieId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie._id !== movieId)
      );
    } catch (error) {
      setError("Failed to delete movie from watchlist");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="body">
        <div className="watchlist-container">
          <h2 className="watchlist-title">Watch List</h2>
          {movies.length === 0 ? (
            <p>Your watchlist is empty.</p>
          ) : (
            <div className="movie-cards-container">
              {movies.map((movie) => (
                <div key={movie._id} className="movie-card">
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-details">
                    <Link to={`/watch/${movie._id}`} className="link">
                      <h3 className="movie-title">{movie.title}</h3>
                    </Link>
                    <p className="movie-description">{movie.desc}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteMovie(movie._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Watchlist;
