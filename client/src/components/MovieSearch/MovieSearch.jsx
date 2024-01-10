import React from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectStateResults,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { Link } from "react-router-dom";
import "./MovieSearch.css";

const searchClient = algoliasearch(
  "4G08E0VT5F",
  "428e81d53f5d1d2942185eb16a4dbf3c"
);

const Hit = ({ hit }) => (
  <article>
    <img src={hit.img} alt={hit.title} />
    <Link to={`/watch/${hit.objectID}`} className="link">
      <h3>{hit.title}</h3>
    </Link>
    <p>{hit.desc}</p>
    <h4>Genre: {hit.genre}</h4>
  </article>
);

const CustomHits = connectStateResults(({ searchState }) =>
  searchState && searchState.query ? <Hits hitComponent={Hit} /> : null
);

function MovieSearch() {
  return (
    <div className="search-container">
      <InstantSearch indexName="movies" searchClient={searchClient}>
        <div className="search-box-container">
          <SearchBox className="ais-SearchBox-input" />
        </div>
        <CustomHits />
      </InstantSearch>
    </div>
  );
}

export default MovieSearch;
