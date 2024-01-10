const express = require("express");
const router = express.Router();
const UserHistory = require("../models/UserHistory");
const User = require("../models/User");
const Movie = require("../models/Movie");
const verify = require("../verifyToken");
const mongoose = require("mongoose");
// Add a movie to the user's watched history
router.post("/add", verify, async (req, res) => {
  try {
    const { user_id, movie_id } = req.body;

    // Check if the user with the provided userId exists
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Find the user's history record
    const userHistory = await UserHistory.findOne({ user: user_id });

    if (!userHistory) {
      // If the user doesn't have a history record yet, create one
      const newUserHistory = new UserHistory({
        user: user_id,
        movies: [{ movie: movie_id, watchedDate: Date.now() }],
      });
      await newUserHistory.save();
    } else {
      // Check if the movie is already in the user's history
      const existingMovie = userHistory.movies.find(
        (entry) => entry.movie.toString() === movie_id
      );

      if (existingMovie) {
        // If the movie is already in the history, update the watched date
        existingMovie.watchedDate = Date.now();
      } else {
        // If the movie is not in the history, add it with the current watched date
        userHistory.movies.push({ movie: movie_id, watchedDate: Date.now() });
      }

      await userHistory.save();
    }

    res.json({ message: "Movie added to history." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the user's watched movies
router.get("/:userId", verify, async (req, res) => {
  try {
    const user_id = req.params.userId;

    const history = await UserHistory.findOne({ user: user_id }).populate({
      path: "movies",
      select: "title watchedDate",
      populate: {
        path: "movie",
        select: "img title",
      },
    });

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    if (history.movies.length === 0) {
      return res.status(200).json({ message: "History is empty" });
    }

    res.json(history.movies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Clear the user's watch history
router.post("/clear/:userId", verify, async (req, res) => {
  try {
    const user_id = req.params.userId;

    const userHistory = await UserHistory.findOne({ user: user_id });

    if (userHistory) {
      userHistory.movies = []; // Clear the movies array
      await userHistory.save();
    }

    res.json({ message: "Watch history cleared." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route to get movie recommendations based on the user's history
// Recommendations Route
router.get("/recommendations/:user_id", verify, async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userHistory = await UserHistory.findOne({ user: user_id }).populate({
      path: "movies",
      populate: { path: "movie" },
    });

    if (!userHistory || userHistory.movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found in the history" });
    }

    const genreCounts = {};
    userHistory.movies.forEach((entry) => {
      const movie = entry.movie;
      if (movie.genre) {
        if (genreCounts[movie.genre]) {
          genreCounts[movie.genre] += 1;
        } else {
          genreCounts[movie.genre] = 1;
        }
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
