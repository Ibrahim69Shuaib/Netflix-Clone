const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const listRoute = require("./routes/lists");
const notificationsRoute = require("./routes/notifications");
const searchRoute = require("./routes/search");
const watchlistRoute = require("./routes/watchList");
const historyRoute = require("./routes/history");
const { subscribeAllUsersToTopic, saveToken } = require("./pushNotifications");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful !");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());

//end points
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
app.use("/api/notifications", notificationsRoute);
app.use("/api/search", searchRoute);
app.use("/api/watchlist", watchlistRoute);
app.use("/api/history", historyRoute);
app.listen(8800, () => {
  console.log("Backend server is running !");
});
