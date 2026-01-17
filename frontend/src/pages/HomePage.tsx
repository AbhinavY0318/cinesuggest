import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { MovieCard as MovieCardType } from "../types/tmdb";

import MovieCardComponent from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/home", { params: { category: "popular", limit: 20 } })
      .then(res => setMovies(res.data))
      .catch(err => console.error("Home error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎬 Trending Movies</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {movies.map(m => (
          <MovieCardComponent
            key={m.tmdb_id}
            movie={m}
            onClick={() => navigate(`/movie/${m.tmdb_id}`)}
          />
        ))}
      </div>
    </div>
  );
}
