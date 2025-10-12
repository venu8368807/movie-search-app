const API_KEY = "746e23fce648bb6f9a4e7e05d87ee8a6";
const BASE_URL = "https://api.themoviedb.org/3";

// Get movie genres list
export const getGenres = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.genres || [];
  } catch (err) {
    console.error("Failed to fetch genres:", err);
    return [];
  }
};

// Get popular movies
export const getPopularMovies = async (
  page = 1,
  sort = "popularity.desc",
  year = "",
  genre = "",
  language = ""
) => {
  try {
    const url = new URL(`${BASE_URL}/discover/movie`);
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("sort_by", sort);
    url.searchParams.append("page", page);
    if (year) url.searchParams.append("primary_release_year", year);
    if (genre) url.searchParams.append("with_genres", genre);
    if (language) url.searchParams.append("with_original_language", language);

    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error("Failed to fetch popular movies:", err);
    return [];
  }
};

// Search movies
export const searchMovies = async (
  query,
  page = 1,
  year = "",
  genre = "",
  language = ""
) => {
  try {
    const url = new URL(`${BASE_URL}/search/movie`);
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("query", query);
    url.searchParams.append("page", page);
    if (year) url.searchParams.append("primary_release_year", year);
    if (genre) url.searchParams.append("with_genres", genre);
    if (language) url.searchParams.append("with_original_language", language);

    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch (err) {
    console.error("Failed to search movies:", err);
    return [];
  }
};

// Get full movie details (details + cast + streaming platforms)
export const getFullMovieDetails = async (movieId) => {
  try {
    const [detailsRes, creditsRes, providersRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`),
      fetch(
        `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
      ),
      fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`),
    ]);

    const details = await detailsRes.json();
    const credits = await creditsRes.json();
    const providers = await providersRes.json();

    const director = credits.crew.find((person) => person.job === "Director");
    const cast = credits.cast.slice(0, 10);

    const flatrate =
      providers.results?.IN?.flatrate || providers.results?.US?.flatrate || [];

    return {
      ...details,
      director: director ? director.name : "Unknown",
      cast,
      platforms: flatrate.map((p) => p.provider_name),
    };
  } catch (err) {
    console.error("Error fetching full movie details:", err);
    return null;
  }
};

export const getMovieTrailer = async (movieId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    // Find official trailer or teaser from YouTube
    const trailer =
      data.results.find(
        (v) =>
          v.site === "YouTube" &&
          (v.type === "Trailer" || v.type === "Teaser") &&
          v.official
      ) ||
      data.results.find((v) => v.site === "YouTube" && v.type === "Trailer");

    return trailer ? trailer.key : null; // return the video key only
  } catch (error) {
    console.error("Error fetching trailer:", error);
    return null;
  }
};
