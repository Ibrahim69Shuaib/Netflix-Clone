import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./authContext/AuthContext";
// Register the service worker
const loadServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
        function (registration) {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          console.log("Service Worker registration failed: ", err);
        }
      );
    });
  }
};
//code above not sure if its correct
const initializeApp = async () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  loadServiceWorker();
  root.render(
    <React.StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </React.StrictMode>
  );
};
initializeApp();
