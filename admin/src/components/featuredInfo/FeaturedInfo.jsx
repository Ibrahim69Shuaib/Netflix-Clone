import "./featuredInf.css";
import { ArrowUpward } from "@mui/icons-material";
import { useContext } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { MovieContext } from "../../context/movieContext/MovieContext";

export default function FeaturedInfo() {
  const { users } = useContext(UserContext);
  const { movies } = useContext(MovieContext);
  const numberOfUsers = users.length;
  const numberOfMovies = movies.filter((movie) => !movie.isSeries).length;
  const numberOfSeries = movies.filter((movie) => movie.isSeries).length;

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Number of Users</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{numberOfUsers}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Total Users</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Number of Movies</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{numberOfMovies}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Number of Series</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{numberOfSeries}</span>
          <span className="featuredMoneyRate">
            <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}