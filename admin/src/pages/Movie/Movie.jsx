import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./movie.css";
export default function Movie() {
  const location = useLocation();
  const { movieId } = useParams("id");
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  // const [description, setDescription] = useState("");

  const fetchMovie = async () => {
    try {
      const { data } = await axios.get(`/movies/find/${movieId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });

      if (data.message) {
        // setError(response.data.message);
      } else {
        setMovie(data);
        setData({
          ...data,
          title: data.title,
          year: data.year,
          duration: data.duration,
          desc: data.desc,
          genre: data.genre,
          limit: data.limit,
        });
      }
      // setLoading(false);
    } catch (error) {
      // setError("Failed to fetch watchlist");
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const handleChange = (e, key) => {
    setData((prev) => {
      return {
        ...prev,
        [key]: e.target.value,
      };
    });
  };

  // const handleDescriptionChange = (e) => {
  //   setDescription(e.target.value);
  // };

  // console.log("data", data);

  const handleSave = async (e) => {
    e.preventDefault();
    navigate("/movies");
    console.log(JSON.parse(localStorage.getItem("user")).accessToken);

    try {
      const res = await axios.put(`/movies/${movieId}`, data, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      console.log("res", res);
    } catch (error) {
      // setError("Failed to fetch watchlist");
      // setLoading(false);
    }
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">Edit Movie</h1>
      <form className="addProductForm" onSubmit={(e) => handleSave(e)}>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            value={data.title}
            placeholder="John Wick"
            name="title"
            onChange={(e) => handleChange(e, "title")}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            value={data.desc}
            type="text"
            placeholder="description"
            name="desc"
            onChange={(e) => handleChange(e, "desc")}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            value={data.year}
            type="text"
            placeholder="Year"
            name="year"
            onChange={(e) => handleChange(e, "year")}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <select
            value={data.genre}
            name="genre"
            onChange={(e) => handleChange(e, "genre")}
          >
            <option value="">Select a genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            value={data.duration}
            type="text"
            placeholder="Duration"
            name="duration"
            onChange={(e) => handleChange(e, "duration")}
          />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input
            value={data.limit}
            type="text"
            placeholder="limit"
            name="limit"
            onChange={(e) => handleChange(e, "limit")}
          />
        </div>
        <div className="saveButton">
          <button className="productButton" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
