import React, { useState } from "react";
import "../CSS/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../MovieCard";
import { getFullMovieDetails, getMovieTrailer } from "../services/api";
import MovieModal from "../MovieModal";

const FavPage = () => {
  const { favorites } = useMovieContext();

  // Modal state
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [cast, setCast] = useState([]);

  // Open movie modal
  const openMovieModal = async (movie) => {
    try {
      const details = await getFullMovieDetails(movie.id);
      setMovieDetails(details);
      setCast(details.cast || []);
      const trailer = await getMovieTrailer(movie.id);
      setTrailerUrl(trailer);
    } catch (err) {
      console.error("Failed to fetch movie data:", err);
    }
  };

  const closeModal = () => {
    setMovieDetails(null);
    setTrailerUrl(null);
    setCast([]);
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites no-favorites">
        <h2>No favorites yet 😕</h2>
        <p>Add some movies to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <div className="movies-grid">
        {favorites.map((movie) => (
          <MovieCard
            movie={movie}
            key={movie.id}
            onClick={() => openMovieModal(movie)}
          />
        ))}
      </div>

      {movieDetails && (
        <MovieModal
          movieDetails={movieDetails}
          trailerUrl={trailerUrl}
          cast={cast}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default FavPage;
