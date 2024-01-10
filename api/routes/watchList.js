const router = require("express").Router();
const WatchList = require("../models/Watch_List");
const verify = require("../verifyToken");
const User = require("../models/User");
const Movie = require("../models/Movie");
const mongoose = require("mongoose");
// Route to add a movie to the watchlist
router.post("/add", verify, async (req, res) => {
  try {
    const { user_id, movie_id } = req.body;

    const user = await User.findById(user_id);
    const movie = await Movie.findById(movie_id);

    if (!user || !movie) {
      return res.status(400).json({ message: "User or movie not found" });
    }

    // Find the user's watchlist or create a new one if it doesn't exist
    let watchlist = await WatchList.findOne({ user }).populate("movies");

    if (!watchlist) {
      watchlist = new WatchList({ user, movies: [] });
    }

    // Check if the movie is not already in the watchlist
    const movieAlreadyInWatchlist = watchlist.movies.some((watchlistMovie) =>
      watchlistMovie._id.equals(movie._id)
    );

    if (movieAlreadyInWatchlist) {
      return res
        .status(400)
        .json({ message: "Movie is already in the watchlist" });
    }

    watchlist.movies.push(movie);
    await watchlist.save();
    res.status(200).json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get the user's watchlist
router.get("/:user_id", verify, async (req, res) => {
  try {
    const user_id = req.params.user_id;

    // Check if the provided user_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchlist = await WatchList.findOne({ user }).populate("movies");
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    if (watchlist.movies.length === 0) {
      return res.status(200).json({ message: "Watchlist is empty" });
    }

    // Map the movies array to include the movie image URL
    const moviesWithImage = watchlist.movies.map((movie) => ({
      _id: movie._id,
      title: movie.title,
      desc: movie.desc,
      img: movie.img,
    }));

    res.status(200).json(moviesWithImage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to delete a movie from the watchlist
router.delete("/:user_id/:movie_id", verify, async (req, res) => {
  try {
    const { user_id, movie_id } = req.params;

    // Check if the provided user_id and movie_id are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(movie_id)
    ) {
      return res.status(400).json({ message: "Invalid user or movie ID" });
    }

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchlist = await WatchList.findOne({ user }).populate("movies");
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    // Find the index of the movie to delete
    const movieIndex = watchlist.movies.findIndex((movie) =>
      movie._id.equals(movie_id)
    );

    if (movieIndex === -1) {
      return res
        .status(404)
        .json({ message: "Movie not found in the watchlist" });
    }

    // Remove the movie from the watchlist array
    watchlist.movies.splice(movieIndex, 1);
    await watchlist.save();

    res.status(200).json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get movie recommendations based on the user's watchlist
router.get("/recommendations/:user_id", verify, async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const watchlist = await WatchList.findOne({ user: user_id }).populate(
      "movies"
    );

    if (!watchlist || watchlist.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found in the watchlist" });
    } // if watch list is empty it will return message in line before and error 404

    const genreCounts = {};
    watchlist.movies.forEach((movie) => {
      if (genreCounts[movie.genre]) {
        genreCounts[movie.genre] += 1;
      } else {
        genreCounts[movie.genre] = 1;
      }
    });

    const mostFrequentGenre = Object.keys(genreCounts).reduce((a, b) =>
      genreCounts[a] > genreCounts[b] ? a : b
    );

    // Retrieve up to 5 movies from the most frequent genre
    const recommendedMovies = await Movie.find({
      genre: mostFrequentGenre,
    }).limit(5);

    res.status(200).json(recommendedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
