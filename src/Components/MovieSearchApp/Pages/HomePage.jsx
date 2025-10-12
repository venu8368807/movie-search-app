import React, { useState, useEffect, useCallback } from "react";
import MovieCard from "../MovieCard";
import "../CSS/Home.css";
import {
  searchMovies,
  getPopularMovies,
  getGenres,
  getFullMovieDetails,
} from "../services/api";
import MovieModal from "../MovieModal";

const HomePage = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cast, setCast] = useState([]);
  const [showPopularTitle, setShowPopularTitle] = useState(true);

  // Search suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Filters
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Theme toggle
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      const list = await getGenres();
      setGenres(list);
    };
    fetchGenres();
  }, []);

  // Load popular movies
  const loadPopularMovies = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 300));
        const popularMovies = await getPopularMovies(
          pageNum,
          "popularity.desc",
          selectedYear,
          selectedGenre,
          selectedLanguage
        );
        setMovies((prev) =>
          pageNum === 1 ? popularMovies : [...prev, ...popularMovies]
        );
        setPage(pageNum);
        setHasMore(popularMovies.length > 0);
        setError(null);
      } catch {
        setError("Failed to load popular movies.");
      } finally {
        setLoading(false);
      }
    },
    [selectedGenre, selectedLanguage, selectedYear]
  );

  // Auto-load popular movies
  useEffect(() => {
    if (!searchQuery) loadPopularMovies(1);
  }, [
    selectedGenre,
    selectedLanguage,
    selectedYear,
    searchQuery,
    loadPopularMovies,
  ]);

  // ✅ Search handler (closes dropdown after search)
  const handleSearch = useCallback(
    async (e, pageNum = 1) => {
      e?.preventDefault();

      if (!searchQuery.trim()) return;

      setShowSuggestions(false);

      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 300));
        const results = await searchMovies(searchQuery, pageNum);
        setMovies((prev) => (pageNum === 1 ? results : [...prev, ...results]));
        setPage(pageNum);
        setHasMore(results.length > 0);
        setError(null);
      } catch {
        setError("Failed to search movies.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      const dropdown = document.querySelector(".suggestions-dropdown");
      const input = document.querySelector(".search-input");
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        !input.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 300;
      if (nearBottom && !loading && hasMore) {
        if (searchQuery) handleSearch(null, page + 1);
        else loadPopularMovies(page + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, searchQuery, page, handleSearch, loadPopularMovies]);

  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter handler
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setSearchQuery("");
    setPage(1);
  };

  // Show/hide popular title
  useEffect(() => {
    setShowPopularTitle(
      !searchQuery && !selectedGenre && !selectedLanguage && !selectedYear
    );
  }, [searchQuery, selectedGenre, selectedLanguage, selectedYear]);

  // Open movie modal
  const openMovieModal = async (movie) => {
    try {
      const details = await getFullMovieDetails(movie.id);
      setMovieDetails(details);
      setCast(details.cast || []);
    } catch (err) {
      console.error("Failed to fetch movie data:", err);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim()) return;
    try {
      const results = await searchMovies(query, 1);
      setSuggestions(results.slice(0, 5));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) fetchSuggestions(searchQuery);
      else setShowSuggestions(false);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, fetchSuggestions]);

  // Years dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-shimmer"></div>
    </div>
  );

  return (
    <div className="home">
      {/* Theme toggle */}
      <div className="theme-toggle">
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={(e) => {
            if (!suggestions.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
              );
            } else if (e.key === "Enter") {
              if (highlightedIndex >= 0) {
                const selected = suggestions[highlightedIndex];
                setSearchQuery(selected.title);
                setShowSuggestions(false);
                handleSearch(null, 1);
                setHighlightedIndex(-1);
              } else {
                // ✅ If no suggestion selected, still close dropdown
                setShowSuggestions(false);
                handleSearch(null, 1);
              }
            } else if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
        />
        <button type="submit" className="search-button">
          Search
        </button>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            <ul>
              {suggestions.map((movie, index) => (
                <li
                  key={movie.id}
                  onClick={() => {
                    setSearchQuery(movie.title);
                    setShowSuggestions(false);
                    handleSearch(null, 1);
                    setHighlightedIndex(-1);
                  }}
                  className={highlightedIndex === index ? "highlighted" : ""}
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>

      {/* Filters */}
      {!searchQuery && (
        <div className="filter-bar">
          <select
            value={selectedGenre}
            onChange={(e) =>
              handleFilterChange(setSelectedGenre)(e.target.value)
            }
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) =>
              handleFilterChange(setSelectedLanguage)(e.target.value)
            }
          >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) =>
              handleFilterChange(setSelectedYear)(e.target.value)
            }
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Popular Movies Title */}
      {showPopularTitle && movies.length > 0 && (
        <div className="scrolling-title-wrapper">
          <h2 className="rainbow-title">
            Today's Popular Movies Around the World
          </h2>
        </div>
      )}

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Movie Grid */}
      {movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <MovieCard
              movie={movie}
              style={{ animationDelay: `${index * 0.1}s` }}
              key={movie.id}
              onClick={openMovieModal}
            />
          ))}
        </div>
      ) : (
        !loading && <p className="no-movies">No movies found.</p>
      )}

      {/* Skeleton loader */}
      {loading && page > 1 && (
        <div className="movies-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Spinner */}
      {loading && page === 1 && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {/* Movie Modal */}
      {movieDetails && (
        <MovieModal
          movieDetails={movieDetails}
          cast={cast}
          onClose={() => {
            setMovieDetails(null);
            setCast([]);
          }}
        />
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ⬆
        </button>
      )}
    </div>
  );
};

export default HomePage;
