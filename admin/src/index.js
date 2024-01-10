import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext/AuthContext";
import { MovieContextProvider } from "./context/movieContext/MovieContext";
import { ListContextProvider } from "./context/listContext/ListContext";
import { UserContextProvider } from "./context/userContext/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <AuthContextProvider>
        <MovieContextProvider>
          <ListContextProvider>
            <App />
          </ListContextProvider>
        </MovieContextProvider>
      </AuthContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
