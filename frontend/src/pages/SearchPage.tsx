import {  useState } from "react";
import { api } from "../services/api";
import type { MovieCard as MovieCardType } from "../types/tmdb";
import MovieCardComponent from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<MovieCardType[]>([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    api.get("/tmdb/search", { params: { query } })
      .then(res => {
        const results = res.data.results || [];
        setMovies(results.map((m: any) => ({
          tmdb_id: m.id,
          title: m.title,
          poster_url: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : undefined
        })));
      })
      .catch(console.error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 Search Movies</h2>

      <input
        placeholder="Search titles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "300px", padding: "8px", marginRight: "10px" }}
      />

      <button onClick={handleSearch}>Search</button>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
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
