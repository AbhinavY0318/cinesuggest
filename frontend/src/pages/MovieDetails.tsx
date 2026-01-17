import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useParams } from "react-router-dom";
import type { SearchBundle } from "../types/tmdb";
import MovieCardComponent from "../components/MovieCard";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const [data, setData] = useState<SearchBundle | null>(null);

  useEffect(() => {
    if (!id) return;

    api.get(`/movie/search`, {
      params: { query: id, tfidf_top_n: 8, hybrid_top_n: 8, genre_limit: 8 }
    })
      .then(res => setData(res.data))
      .catch(console.error);
  }, [id]);

  if (!data) return <div style={{ padding: "20px" }}>Loading...</div>;

  const d = data.movie_details;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{d.title}</h2>
      <p>{d.overview}</p>
      {d.poster_url && <img src={d.poster_url} width="200" alt={d.title} />}

      <h3>TF-IDF Recommendations</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data.tfidf_recommendations.map((r, i) =>
          r.tmdb && <MovieCardComponent key={i} movie={r.tmdb} />
        )}
      </div>

      <h3>Hybrid Recommendations (Mood + Topic)</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data.hybrid_recommendations.map((r, i) =>
          r.tmdb && <MovieCardComponent key={i} movie={r.tmdb} />
        )}
      </div>

      <h3>Genre Recommendations</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {data.genre_recommendations.map((m, i) =>
          <MovieCardComponent key={i} movie={m} />
        )}
      </div>
    </div>
  );
}
