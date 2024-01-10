import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import "./history.scss";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const History = ({ userId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = JSON.parse(localStorage.getItem("user"))._id;

      try {
        const response = await axios.get(`/history/${userId}`, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        setLoading(true);
        setError(null);

        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          setMovies([]);
        }

        setLoading(false);
      } catch (error) {
        setError("Failed to fetch history.");
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const handleClearHistory = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    try {
      await axios.post(`/history/clear/${userId}`, null, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      setMovies([]);
    } catch (error) {
      setError("Failed to clear history.");
    }
  };

  return (
    <div>
      <div className="navbar-watchlist">
        <Navbar isChange />
      </div>

      <div className="body">
        <div className="button">
          <button title="Clear">
            <DeleteIcon
              onClick={handleClearHistory}
              style={{ fontSize: 24, color: "red" }}
            />
          </button>
        </div>
        <div className="watchlist-container">
          <h2 className="watchlist-title">My History</h2>
          <h3 className="title2">You previously watched</h3>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="movie-cards-container">
              {movies.length === 0 ? (
                <p>No movies in history.</p>
              ) : (
                movies.map((movie) => (
                  <div key={movie.movie._id} className="movie-card">
                    <img
                      className="movie-poster"
                      src={movie.movie.img}
                      alt={movie.movie.title}
                    />
                    <div className="movie-details">
                      <Link to={`/watch/${movie.movie._id}`} className="link">
                        <h3 className="movie-title">{movie.movie.title}</h3>
                      </Link>
                      <p className="movie-description">
                        Watched Date: {movie.watchedDate}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
