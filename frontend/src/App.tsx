import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import MovieDetailsPage from "./pages/MovieDetails";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
        <Link to="/">Home</Link> | <Link to="/search">Search</Link>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
