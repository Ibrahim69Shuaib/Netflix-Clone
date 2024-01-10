import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import "./app.css";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import MovieList from "./pages/MovieList/MovieList";
import Movie from "./pages/Movie/Movie";
import NewMovie from "./pages/newMovie/NewMovie";
import Login from "./pages/login/Login";
import ListList from "./pages/listList/ListList";
import List from "./pages/list/List";
import NewList from "./pages/newList/NewList";
import Messages from "./pages/Messages/Messages";
import { AuthContext } from "./context/authContext/AuthContext";
import { useContext } from "react";
import EditProfile from "./pages/EditProfile/EditProfile";
function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {user ? (
        <>
          {user && <Topbar />}
          <div className={user ? "container" : ""}>
            {user && <Sidebar />}
            <Routes>
              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login />}
              />
              {user && (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/user/:userId" element={<User />} />
                  <Route path="/newUser" element={<NewUser />} />
                  <Route path="/movies" element={<MovieList />} />
                  <Route path="/movie/:movieId" element={<Movie />} />
                  <Route path="/newMovie" element={<NewMovie />} />
                  <Route path="/lists" element={<ListList />} />
                  <Route path="/list/:listId" element={<List />} />
                  <Route path="/newlist" element={<NewList />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/EditProfile" element={<EditProfile/>} />
                  
                </>
              )}
            </Routes>
          </div>
        </>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}

export default App;
