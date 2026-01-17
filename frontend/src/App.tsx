import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeView from './components/HomeView';
import DetailsView from './components/DetailsView';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
          <nav className="border-b border-white/10 backdrop-blur-lg bg-slate-900/70 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                CineSuggest
              </h1>
              <p className="text-slate-400 text-sm">Discover your next favorite movie</p>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/details/:tmdbId" element={<DetailsView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;