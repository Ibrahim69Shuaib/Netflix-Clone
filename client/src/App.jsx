import React from "react";
import "./App.scss";
import Home from "./Pages/home/Home";
import Register from "./Pages/register/Register";
import Login from "./Pages/login/Login";
import Watch from "./Pages/watch/Watch";
import Browse from "./Pages/browse/Browse";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";
import { useEffect } from "react";
import { messaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";
import History from "./Pages/history/history";
import WatchList from "./Pages/watchList/watchList";
import EditProfile from "./Pages/editProfile/EditProfile";
function App() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: "vapidKey", //replace with your firebase vapidKey
      });
      console.log(token);

      if (token) {
        onMessage(messaging, (payload) => {
          // Handling receiving notifications when application is in foreground
          console.log("Notification received: ", payload);
        });
        //delete axios.post if want to add token manually
        //sending token to backend to be added to registration array
        await axios.post("notifications/save-token", { token });
      } else {
        console.error("Token not available");
      }
    } catch (error) {
      console.error("Error getting token", error);
    }
  };

  //code above for firebase push notification

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Home /> : <Navigate to="/register" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        {user && (
          <>
            <Route path="/movies" element={<Home type="movie" />} />
            <Route path="/series" element={<Home type="series" />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/watchList" element={<WatchList />} />
            <Route path="/history" element={<History />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/browse" element={<Browse />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
