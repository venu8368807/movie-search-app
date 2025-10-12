import React, { useState, useRef } from "react";
import "./CSS/MovieCard.css";
import { useMovieContext } from "./contexts/MovieContext";
import { getMovieTrailer } from "./services/api";

const MovieCard = ({ movie, onClick }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const hoverTimer = useRef(null);

  const onFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  };

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(async () => {
      const trailer = await getMovieTrailer(movie.id);
      if (trailer) {
        setTrailerKey(trailer);
        setShowTrailer(true);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    setShowTrailer(false);
    setTrailerKey(null);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handleYouTubeClick = (e) => {
    e.stopPropagation();
    // Stop local trailer before opening YouTube
    setShowTrailer(false);
    setTrailerKey(null);
    // Then open in new tab
    window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
  };

  return (
    <div
      className={`movie-card ${showTrailer ? "trailer-active" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick && onClick(movie)}
    >
      <div className="movie-poster">
        {showTrailer && trailerKey ? (
          <div className="trailer-wrapper">
            <iframe
              className="movie-trailer"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${
                isMuted ? 1 : 0
              }&controls=0&modestbranding=1`}
              title="Trailer Preview"
              allow="autoplay; encrypted-media; picture-in-picture"
            ></iframe>

            {/* Sound Toggle */}
            <button className="sound-toggle" onClick={toggleMute}>
              {isMuted ? "🔇" : "🔊"}
            </button>

            {/* YouTube Watch Button */}
            <button className="youtube-link-btn" onClick={handleYouTubeClick}>
              ▶ Watch on YouTube
            </button>
          </div>
        ) : (
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title}
          />
        )}

        {/* Favorite Button */}
        <div className="movie-button">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ❤︎
          </button>
        </div>

        {/* Hover message - hidden while trailer plays */}
        {!showTrailer && (
          <div className="hover-message">Click to show full details</div>
        )}
      </div>

      {/* Movie title - hidden while trailer plays */}
      {!showTrailer && (
        <div className="movie-info">
          <h3>{movie.title}</h3>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
