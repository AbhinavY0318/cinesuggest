import type { MovieCard as MovieCardType } from "../types/tmdb";

interface Props {
  movie: MovieCardType;
  onClick?: () => void;
}

export default function MovieCard({ movie, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "160px",
        cursor: "pointer",
        textAlign: "center",
        margin: "10px",
      }}
    >
      {movie.poster_url ? (
        <img
          src={movie.poster_url}
          alt={movie.title}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      ) : (
        <div style={{ width: "100%", height: "240px", background: "#ddd" }} />
      )}
      <div style={{ marginTop: "8px", fontSize: "0.9rem" }}>{movie.title}</div>
    </div>
  );
}
