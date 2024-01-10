const router = require("express").Router();
const algoliasearch = require("algoliasearch");
const Movie = require("../models/Movie");

const client = algoliasearch("4G08E0VT5F", "da7411d97cf60653afd2ec33f2751b32");
// console.log(client);
const index = client.initIndex("movies");
// console.log(index);

function movieToAlgoliaObject(movie) {
  return {
    objectID: movie._id.toString(),
    title: movie.title,
    desc: movie.desc,
    genre: movie.genre,
    img: movie.img,
  };
}

// Index all movies
async function indexMovies() {
  try {
    const movies = await Movie.find(); // Fetch all movies from your MongoDB collection
    const objectsToIndex = movies.map(movieToAlgoliaObject);
    JSON.stringify(objectsToIndex);
    // console.log(JSON.stringify(objectsToIndex, null, 2));
    // Save the movie data to Algolia
    const { objectIDs } = await index.saveObjects(objectsToIndex);

    console.log(`Indexed ${objectIDs.length} movies`);
  } catch (error) {
    console.error("Error indexing movies:", error);
  }
}

// Call the function to index movies
indexMovies();

// async function fetchMovies() {
//   const movies = await Movie.find();

//   const moviesObject = {};
//   movies.forEach((movie) => {
//     // Store only specific key-value pairs in the moviesObject
//     moviesObject[movie._id] = {
//       title: movie.title,
//       director: movie.director,
//       // Add more properties as needed
//     };
//   });

//   return moviesObject;
// }
// async function saveMovies() {
//   const moviesObject = await fetchMovies();

//   await index.saveObjects(moviesObject, {
//     autoGenerateObjectIDIfNotExist: false,
//   });

//   console.log("Movies saved successfully.");
// }

// saveMovies();

// const indexMovies = async () => {
//   try {
//     const movies = await Movie.find();
// const algoliaMovies = movies.map((movie) => ({
//   // objectID: movie.objectID, // Assuming objectID is a property with the ObjectId value
//   title: "test",
//   desc: "test",
//   genre: "test",
//   // Add other relevant fields
// }));
// console.log(algoliaMovies);
// await index
//   .saveObjects(algoliaMovies, { autoGenerateObjectIDIfNotExist: true })
//   .then((x) => console.log(x));

//     const objects = [{
//       "firstname": 'Jimmie',
//       "lastname": 'Barninger',
//       objectID: 'myID1'
//     }, {
//       "firstname": 'Warren',
//       "lastname": 'Speach',
//       objectID: 'myID2'
//     }];

//     index
//   .saveObjects(objects)
//   .then(({ objectIDs }) => {
//     console.log(objectIDs);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

//     console.log("Movies indexed successfully:");
//   } catch (error) {
//     console.error("Error indexing movies:", error);
//   }
// };

// indexMovies();

//search route below is not used but keep it as it is

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const { hits } = await index.search(query);
    res.send(hits);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).send("An error occurred while searching movies");
  }
};
router.get("/search", search);

module.exports = router;
