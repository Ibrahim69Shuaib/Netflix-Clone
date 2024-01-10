import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./watch.scss";
import "../../components/footer/Footer";
import Footer from "../../components/footer/Footer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import DownloadIcon from "@mui/icons-material/Download";

const API_KEY = "TMDB API KEY"; //replace with your TMDB API key

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [productionCompanies, setProductionCompanies] = useState([]);
  const [runtime, setRuntime] = useState(0);
  const [actressPhotos, setActressPhotos] = useState([]);
  const [actressesNames, setActressesNames] = useState([]);
  const [actressProfileUrls, setActressProfileUrls] = useState([]);
  const [backdropUrl, setBackdropUrl] = useState("");
  const [voteAverage, setVoteAverage] = useState(0);
  const [ageLimit, setAgeLimit] = useState("");
  const [isSeries, setIsSeries] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [playClicked, setPlayClicked] = useState(false);
  const getMovie = async (movieId) => {
    try {
      const res = await axios.get(`/movies/find/${movieId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      setMovie(res.data);
      setAgeLimit(res.data.limit);
      setIsSeries(res.data.isSeries);
    } catch (err) {
      console.log(err);
    }
  };

  const getMovieDetails = async (movieName, isSeries) => {
    try {
      let res;
      if (isSeries) {
        res = await axios.get(
          `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
            movieName
          )}`
        );
      } else {
        res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            movieName
          )}`
        );
      }

      if (res.data.results.length > 0) {
        const movieDetails = res.data.results[0];
        setMovieDetails(movieDetails);
        const backdropUrl = `https://image.tmdb.org/t/p/original/${movieDetails.backdrop_path}`;
        setBackdropUrl(backdropUrl);
        setVoteAverage(movieDetails.vote_average);

        const movieId = movieDetails.id;
        let movieRes;
        if (isSeries) {
          movieRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}`
          );
        } else {
          movieRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
          );
        }

        if (movieRes.data.genres) {
          setGenres(movieRes.data.genres);
        }
        if (movieRes.data.production_companies) {
          setProductionCompanies(movieRes.data.production_companies);
        }
        if (movieRes.data.runtime) {
          setRuntime(movieRes.data.runtime);
        }

        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/${
            isSeries ? "tv" : "movie"
          }/${movieId}/credits?api_key=${API_KEY}`
        );
        if (creditsRes.data.cast && creditsRes.data.cast.length > 0) {
          const cast = creditsRes.data.cast;
          const actresses = cast.filter(
            (person) => person.known_for_department === "Acting"
          );
          const actressPhotos = actresses
            .slice(0, 5)
            .map((actress) => actress.profile_path);
          setActressPhotos(actressPhotos);

          const actressesNames = actresses.map((actress) => actress.name);
          setActressesNames(actressesNames);

          const actressProfileUrls = actresses.map((actress) =>
            actress.profile_path
              ? `https://www.themoviedb.org/person/${actress.id}-${actress.name
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`
              : null
          );
          setActressProfileUrls(actressProfileUrls);
        }
      } else {
        console.log("Movie/series not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      await getMovie(id);
    };
    if (id) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    if (movie) {
      getMovieDetails(movie.title, movie.isSeries);
    }
  }, [movie]);

  if (!movie || !movieDetails) {
    return (
      <div className="loadingSpinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const { title, overview, release_date, poster_path } = movieDetails;
  const handlePlayClick = async () => {
    try {
      const trailerRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieDetails.id}/videos?api_key=${API_KEY}`
      );
      if (trailerRes.data.results.length > 0) {
        const trailerKey = trailerRes.data.results[0].key;
        const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
        window.open(trailerUrl, "_blank");
      } else {
        console.log("Trailer not found");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!movie || !movieDetails) {
    return (
      <div className="loadingSpinner">
        <div className="spinner"></div>
      </div>
    );
  }
  const MyListClick = () => {
    navigate({
      pathname: `/WatchList`,
    }); // Navigate to watch page with movie object in state
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
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
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
  const handleDownload = () => {
    const downloadUrl = movie.video;
    fetch(downloadUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "video.mp4");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.log("Error downloading the file:", error);
      });
  };
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handlePlay = async () => {
    try {
      if (!playClicked) {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        const movieId = movie._id;

        const response = await axios.post(
          "/history/add",
          {
            user_id: userId,
            movie_id: movieId,
          },
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        console.log(response.data);
        setPlayClicked(true);
      }
    } catch (error) {
      console.log("Failed to add movie to history.", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="watch-container">
        <div className="background">
          {backdropUrl && (
            <div className="backdrop-container">
              <img className="backdrop" src={backdropUrl} alt="Backdrop" />
              <div className="overlay"></div>
            </div>
          )}
          <div className="details-container">
            <div className="flex">
              <div className="poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
                  alt={title}
                  className="shadow"
                />
                <div className="rating">
                  <div className="rating-circle">
                    <div
                      className="custom-progress-bar"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <CircularProgressbar
                        value={Math.round(voteAverage * 10)}
                        text={`${Math.round(voteAverage * 10)}%`}
                        styles={{
                          root: {
                            backgroundColor: "#032541",
                            borderRadius: "50%",
                            padding: "10px",
                          },
                          path: {
                            stroke: "#21d07a",
                          },
                          trail: {
                            stroke: "#f2f2f2",
                          },
                          text: {
                            fill: "#fff",
                            fontSize: "18px",
                            fontWeight: "bold",
                          },
                        }}
                      />
                      {showTooltip && <div className="tooltip">Rating</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="details">
                <h2 className="text-4xl">
                  {isSeries ? movieDetails.name : title}
                </h2>
                <div className="metadata-row">
                  {ageLimit && <p className="limit">{ageLimit}</p>}
                  {isSeries ? null : <p className="metadata">{release_date}</p>}
                  <p className="metadata">
                    {genres.length > 0
                      ? genres.map((genre) => genre.name).join(", ")
                      : "N/A"}
                  </p>
                  <p className="metadata">
                    {!isSeries && <p>Runtime: {runtime} minutes</p>}
                  </p>
                </div>
                <p className="text-lg">{overview}</p>
                <p className="metadata">
                  <strong>Production Companies:</strong>{" "}
                  {productionCompanies.length > 0
                    ? productionCompanies
                        .map((company) => company.name)
                        .join(", ")
                    : "N/A"}
                </p>
                <div className="buttons">
                  <button title="My List">
                    <FormatListBulletedRoundedIcon
                      onClick={MyListClick}
                      style={{ fontSize: 24, color: "red" }}
                    />
                  </button>
                  <button title="Add to My Collections ">
                    <CollectionsBookmarkIcon
                      onClick={handleAddToWatchList}
                      style={{ fontSize: 24, color: "red" }}
                    />
                  </button>
                  <button title="Favorite">
                    <FavoriteIcon style={{ fontSize: 24, color: "red" }} />
                  </button>
                  <button title="Play">
                    <SmartDisplayIcon
                      onClick={handlePlayClick}
                      style={{ fontSize: 24, color: "red" }}
                    />
                  </button>
                  <button
                    className="button"
                    title="Download"
                    onClick={handleDownload}
                  >
                    <DownloadIcon style={{ fontSize: 24, color: "red" }} />
                  </button>
                </div>
                <div className="actress-photos">
                  <h3 className="text-2xl">Actresses</h3>
                  <ul className="photo-list">
                    {actressPhotos.map((photo, index) => (
                      <li key={index} className="shadow">
                        {actressProfileUrls[index] ? (
                          <a
                            href={actressProfileUrls[index]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w200/${photo}`}
                              alt={`Actress ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ) : (
                          <img
                            src={`https://image.tmdb.org/t/p/w200/${photo}`}
                            alt={`Actress ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <p className="text-base">{actressesNames[index]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="video-container">
          <ReactPlayer
            url={movie.video}
            controls
            width="100%"
            height="100%"
            onPlay={handlePlay}
            className="react-player absolute top-0 left-0"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
