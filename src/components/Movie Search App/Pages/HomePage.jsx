import React, { useState, useEffect } from "react";
import MovieCard from "../MovieCard";
import "../CSS/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(Array.isArray(popularMovies) ? popularMovies : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load popular movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(Array.isArray(searchResults) ? searchResults : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to search movies.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : movies && movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      ) : (
        <p className="no-movies">No movies found.</p>
      )}
    </div>
  );
};

export default HomePage;
