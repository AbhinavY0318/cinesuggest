import React from 'react';
import { Link } from 'react-router-dom';

interface Movie {
  tmdb_id: number;
  title: string;
  poster_url?: string;
}

interface Props {
  cards: Movie[];
  title?: string;
  isLoading?: boolean;
  error?: string;
}

const PosterGrid: React.FC<Props> = ({ cards, title, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="aspect-[2/3] bg-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-400">Error: {error}</p>;

  if (!cards.length) return <p className="text-slate-500">No movies found. Try a different category or check API.</p>;

  return (
    <div className="space-y-4">
      {title && <h3 className="text-2xl font-semibold text-white/90">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {cards.map(movie => (
          <Link
            to={`/details/${movie.tmdb_id}`}
            key={movie.tmdb_id}
            className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="aspect-[2/3] bg-slate-800 overflow-hidden">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  No Image
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
              <p className="text-sm font-medium text-white line-clamp-2">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PosterGrid;