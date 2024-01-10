import "./newMovie.css";
import { useContext, useState } from "react";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import supabase from "../../supabase";

export default function NewMovie() {
  const [movie, setMovie] = useState(null);
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [imgSm, setImgSm] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
  };
  const supabaseUrl = "Supabase URL"; // Replace with your Supabase URL
  const bucketName = "Bucket name"; // Replace with your bucket name
  const upload = async (items) => {
    for (const item of items) {
      if (item && item.file) {
        const fileName =
          new Date().getTime() + (item.label || "") + (item.file.name || "");
        const { data, error } = await supabase.storage
          .from("Nullflix") // Update to your bucket name
          .upload(fileName, item.file);

        if (error) {
          console.log(error);
        } else {
          const url = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${fileName}`; // Construct the public URL
          console.log("Uploaded file:", fileName);
          console.log("Public URL:", url);
          setMovie((prev) => {
            return { ...prev, [item.label]: url };
          });
          setUploaded((prev) => prev + 1);
        }
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    await upload([
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: imgSm, label: "imgSm" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
    ]);
    console.log(movie); // just for debugging
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the Supabase URLs to the movie object
    const movieWithUrls = {
      ...movie,
      img: movie?.img || "", // Add the Supabase URL for img or set it as an empty string
      imgTitle: movie?.imgTitle || "", // Add the Supabase URL for imgTitle or set it as an empty string
      imgSm: movie?.imgSm || "", // Add the Supabase URL for imgSm or set it as an empty string
      trailer: movie?.trailer || "", // Add the Supabase URL for trailer or set it as an empty string
      video: movie?.video || "", // Add the Supabase URL for video or set it as an empty string
    };

    // Call createMovie with the updated movie object
    await createMovie(movieWithUrls, supabaseUrl, dispatch);
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title image</label>
          <input
            type="file"
            id="imgTitle"
            name="imgTitle"
            onChange={(e) => setImgTitle(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail image</label>
          <input
            type="file"
            id="imgSm"
            name="imgSm"
            onChange={(e) => setImgSm(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="John Wick"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="description"
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="text"
            placeholder="Year"
            name="year"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <select name="genre" onChange={handleChange}>
            <option value="">Select a genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="text"
            placeholder="Duration"
            name="duration"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Limit</label>
          <input
            type="text"
            placeholder="limit"
            name="limit"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => setTrailer(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        {uploaded === 5 ? (
          <button className="addProductButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
      </form>
    </div>
  );
}
