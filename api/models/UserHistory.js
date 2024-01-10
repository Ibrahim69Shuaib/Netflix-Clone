// models/UserHistory.js
const mongoose = require("mongoose");

const UserHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movies: [
      {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        watchedDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserHistory", UserHistorySchema);
