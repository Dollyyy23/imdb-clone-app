import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "52ea45"; // Replace with your OMDB API key
const API_URL = "https://www.omdbapi.com/";

const App = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);

  useEffect(() => {
    fetchMovies("2024");
  }, []);

  const fetchMovies = async (query) => {
    try {
      const { data } = await axios.get(`${API_URL}?s=${query}&apikey=${API_KEY}`);
      if (data.Search) {
        setMovies(data.Search);
        setErrorMessage("");
      } else {
        setMovies([]);
        setErrorMessage("No results found.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch movies.");
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}?i=${id}&apikey=${API_KEY}`);
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleSearch = () => {
    if (search.trim()) fetchMovies(search);
  };

  const updateFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      updateFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (id) => {
    updateFavorites(favorites.filter((movie) => movie.imdbID !== id));
  };

  return (
    <div className="app-container">
      <header>
        <h1>🎬 IMDB CLone</h1>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      {selectedMovie ? (
        <div className="movie-details">
          <button className="back-btn" onClick={() => setSelectedMovie(null)}>🔙 Back</button>
          <div className="details-content">
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            <div>
              <h2>{selectedMovie.Title}</h2>
              <p><strong>Year:</strong> {selectedMovie.Year}</p>
              <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
              <p><strong>Director:</strong> {selectedMovie.Director}</p>
              <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
              <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
              <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
              <button onClick={() => addToFavorites(selectedMovie)}>❤️ Add to Favorites</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {errorMessage ? <p className="error">{errorMessage}</p> : null}

          <h2>📽 Latest Movies</h2>
          <div className="movie-grid">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card" onClick={() => fetchMovieDetails(movie.imdbID)}>
                <img src={movie.Poster} alt={movie.Title} />
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            ))}
          </div>

          <h2>⭐ Favorite Movies</h2>
          <div className="movie-grid">
            {favorites.length === 0 ? <p>No favorites added.</p> : favorites.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <img src={movie.Poster} alt={movie.Title} />
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
                <button onClick={() => removeFromFavorites(movie.imdbID)}>❌ Remove</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
