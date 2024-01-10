const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
  genre_name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("genre_type", GenreSchema);
