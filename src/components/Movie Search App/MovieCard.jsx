import React from "react";
import "./CSS/MovieCard.css";
import { useMovieContext } from "./contexts/MovieContext";

const MovieCard = ({ movie }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const onFavoriteClick = (e) => {
    e.preventDefault();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={`http://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          height={100}
          width={100}
        />
        <div className="movie-button">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ❤︎
          </button>
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
};

export default MovieCard;
