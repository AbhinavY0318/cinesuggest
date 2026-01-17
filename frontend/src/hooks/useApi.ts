import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE ="http://localhost:8000" ;

export const useHomeFeed = (category: string, limit = 24) =>
  useQuery({
    queryKey: ['home', category],
    queryFn: () => axios.get(`${API_BASE}/home`, { params: { category, limit } }).then(res => res.data),
  });

export const useTmdbSearch = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: () => axios.get(`${API_BASE}/tmdb/search`, { params: { query } }).then(res => res.data),
    enabled: query.length >= 2,
  });

export const useMovieDetails = (id: number) =>
  useQuery({
    queryKey: ['details', id],
    queryFn: () => axios.get(`${API_BASE}/movie/id/${id}`).then(res => res.data),
  });

export const useRecommendations = (title: string) =>
  useQuery({
    queryKey: ['recs', title],
    queryFn: () => axios.get(`${API_BASE}/movie/search`, {
      params: { query: title, tfidf_top_n: 12, genre_limit: 12 }
    }).then(res => res.data),
    enabled: !!title,
  });