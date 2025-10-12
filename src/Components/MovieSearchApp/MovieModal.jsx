import React from "react";
import "./CSS/MovieModal.css";

const MovieModal = ({ movieDetails, cast, onClose, style }) => {
  if (!movieDetails) return null;

  return (
    <div className="modal-overlay" style={style} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          className="modal-poster"
          src={
            movieDetails.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movieDetails.title}
        />
        <div className="modal-info">
          <h2>{movieDetails.title}</h2>
          <p>
            <strong>Directed by:</strong> {movieDetails.director}
          </p>
          <p>
            <strong>Release Date:</strong> {movieDetails.release_date}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {movieDetails.vote_average}
          </p>
          <p>
            <strong>Runtime:</strong> {movieDetails.runtime} min
          </p>
          <p>
            <strong>Language:</strong>{" "}
            {movieDetails.original_language.toUpperCase()}
          </p>
          <p>
            <strong>Genres:</strong>{" "}
            {movieDetails.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="modal-overview">{movieDetails.overview}</p>

          {/* Platforms */}
          {movieDetails.platforms?.length > 0 ? (
            <p>
              <strong>Available on:</strong> {movieDetails.platforms.join(", ")}
            </p>
          ) : (
            <p>
              <strong>Available on:</strong> Not available for streaming
            </p>
          )}

          {/* Cast */}
          {cast.length > 0 && (
            <div className="cast-section">
              <h3>Cast</h3>
              <div className="cast-list">
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-card">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={actor.name}
                    />
                    <p className="actor-name">{actor.name}</p>
                    <p className="character-name">as {actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
