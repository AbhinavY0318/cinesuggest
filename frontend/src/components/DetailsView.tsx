import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMovieDetails, useRecommendations } from '../hooks/useApi';
import PosterGrid from './PosterGrid';

const DetailsView: React.FC = () => {
  const { tmdbId } = useParams();
  const id = Number(tmdbId);

  const { data: details, isLoading: detailsLoading, error: detailsError } = useMovieDetails(id);
  const { data: bundle, isLoading: recsLoading, error: recsError } = useRecommendations(details?.title || '');

  if (detailsLoading) return <div className="text-center text-2xl">Loading...</div>;
  if (detailsError) return <p className="text-red-400">Error loading details: {detailsError.message}</p>;
  if (!details) return <div>Movie not found</div>;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            {details.poster_url && <img src={details.poster_url} alt={details.title} className="w-full" />}
          </div>
        </div>
        <div className="md:col-span-8 space-y-6">
          <h1 className="text-5xl font-bold">{details.title}</h1>
          <div className="flex gap-4 text-slate-300">
            <span>{details.release_date}</span>
            <span>•</span>
            <span>{details.genres?.map((g: any) => g.name).join(', ')}</span>
          </div>
          <p className="text-lg leading-relaxed text-slate-300">{details.overview}</p>
        </div>
      </div>

      <div className="space-y-12">
        <PosterGrid 
          cards={bundle?.tfidf_recommendations?.map((x: any) => x.tmdb).filter(Boolean) || []} 
          title="🔍 TF-IDF Similar" 
          isLoading={recsLoading}
          error={recsError?.message}
        />
        <PosterGrid 
          cards={bundle?.genre_recommendations || []} 
          title="🎭 Same Genre" 
          isLoading={recsLoading}
          error={recsError?.message}
        />
        <PosterGrid 
          cards={bundle?.mood_recommendations || []} 
          title="😊 Similar Mood" 
          isLoading={recsLoading}
          error={recsError?.message}
        />
        <PosterGrid 
          cards={bundle?.topic_recommendations || []} 
          title="📚 Similar Topic" 
          isLoading={recsLoading}
          error={recsError?.message}
        />
      </div>

      <Link to="/" className="inline-block mt-8 text-indigo-400 hover:text-indigo-300 transition-colors">
        ← Back to Home
      </Link>
    </div>
  );
};

export default DetailsView;