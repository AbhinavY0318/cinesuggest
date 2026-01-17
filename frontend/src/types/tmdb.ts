export interface MovieCard {
  tmdb_id: number;
  title: string;
  poster_url?: string;
  release_date?: string;
  vote_average?: number;
}

export interface MovieDetails {
  tmdb_id: number;
  title: string;
  overview?: string;
  release_date?: string;
  poster_url?: string;
  backdrop_url?: string;
  genres: { id: number; name: string }[];
}

export interface TFIDFItem {
  title: string;
  score: number;
  tmdb?: MovieCard;
}

export interface HybridItem {
  title: string;
  score: number;
  mood_match: boolean;
  topic_match: boolean;
  tmdb?: MovieCard;
}

export interface SearchBundle {
  query: string;
  movie_details: MovieDetails;
  tfidf_recommendations: TFIDFItem[];
  hybrid_recommendations: HybridItem[];
  genre_recommendations: MovieCard[];
}
