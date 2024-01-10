import React, { useState, useEffect } from "react";
import "./Home.scss";
import { Featured } from "../../components/featured/Featured";
import List from "../../components/list/List";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import Footer from "../../components/footer/Footer";
import Recolist from "../../components/Recolist/Recolist";

const Home = ({ type }) => {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);

  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `lists${type ? "?type=" + type : ""}${
            genre ? "&genre=" + genre : ""
          }`,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, genre]);

  return (
    <div className="home">
      <Navbar />
      <Featured type={type} setGenre={setGenre} />
      <Recolist title="Recommended Movies Based on Your Watch List" />
      {lists.map((list) => (
        <List list={list} key={list.id} />
      ))}

      <Footer />
    </div>
  );
};

export default Home;
