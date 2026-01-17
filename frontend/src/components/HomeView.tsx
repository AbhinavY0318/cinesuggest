import React, { useState } from 'react';
import { useHomeFeed, useTmdbSearch } from '../hooks/useApi';
import PosterGrid from './PosterGrid';

const categories = ['trending', 'popular', 'top_rated', 'now_playing', 'upcoming'];

const HomeView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');

  const { data: searchResult, isLoading: searchLoading, error: searchError } = useTmdbSearch(searchQuery);
  const { data: homeResult, isLoading: homeLoading, error: homeError } = useHomeFeed(selectedCategory);

  const searchCards = searchResult?.results?.map((m: any) => ({
    tmdb_id: m.id,
    title: m.title,
    poster_url: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : undefined,
  })) || [];

  const homeCards = homeResult || [];

  return (
    <div className="space-y-10">
      <div className="max-w-xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search movies..."
          className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-lg placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {searchQuery ? (
        <PosterGrid 
          cards={searchCards} 
          title="Search Results" 
          isLoading={searchLoading}
          error={searchError?.message}
        />
      ) : (
        <>
          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-slate-300'
                }`}
              >
                {cat.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
          <PosterGrid 
            cards={homeCards} 
            title={selectedCategory.toUpperCase()} 
            isLoading={homeLoading}
            error={homeError?.message}
          />
        </>
      )}
    </div>
  );
};

export default HomeView;