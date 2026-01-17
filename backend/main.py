import os
import pickle
from typing import Optional, List, Dict, Any, Tuple

import numpy as np
import pandas as pd
import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# ========= ENV =========
load_dotenv()
TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_BASE = "https://api.themoviedb.org/3"
TMDB_IMG_500 = "https://image.tmdb.org/t/p/w500"

if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY missing. Put it in .env as TMDB_API_KEY=xxxx")

# ========= APP =========
app = FastAPI(title="CineSuggest API", version="1.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========= GLOBALS =========
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DF_PATH = os.path.join(BASE_DIR, "models", "df.pkl")
TFIDF_MATRIX_PATH = os.path.join(BASE_DIR, "models", "tfidf_matrix.pkl")
TFIDF_PATH = os.path.join(BASE_DIR, "models", "tfidf.pkl")
INDICES_PATH = os.path.join(BASE_DIR, "models", "indices.pkl")

df: Optional[pd.DataFrame] = None
tfidf_matrix = None
tfidf_obj = None
indices: Dict[str, int] = {}

# ========= MODELS =========
class TMDBMovieCard(BaseModel):
    tmdb_id: int
    title: str
    poster_url: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = None


class TMDBMovieDetails(BaseModel):
    tmdb_id: int
    title: str
    overview: Optional[str] = None
    release_date: Optional[str] = None
    poster_url: Optional[str] = None
    backdrop_url: Optional[str] = None
    genres: List[dict] = []


class TFIDFRecItem(BaseModel):
    title: str
    score: float
    tmdb: Optional[TMDBMovieCard] = None


class HybridRecItem(BaseModel):
    title: str
    score: float
    mood_match: bool
    topic_match: bool
    tmdb: Optional[TMDBMovieCard] = None


class SearchBundleResponse(BaseModel):
    query: str
    movie_details: TMDBMovieDetails
    tfidf_recommendations: List[TFIDFRecItem]
    hybrid_recommendations: List[HybridRecItem]
    genre_recommendations: List[TMDBMovieCard]

# ========= HELPERS =========
def norm_title(t: str) -> str:
    return str(t).strip().lower()

def make_img_url(path: Optional[str]) -> Optional[str]:
    return f"{TMDB_IMG_500}{path}" if path else None

async def tmdb_get(path: str, params: Dict[str, Any]):
    q = dict(params)
    q["api_key"] = TMDB_API_KEY
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(f"{TMDB_BASE}{path}", params=q)
    if r.status_code != 200:
        raise HTTPException(status_code=502, detail=f"TMDB error {r.status_code}: {r.text}")
    return r.json()

async def tmdb_movie_details(movie_id: int) -> TMDBMovieDetails:
    data = await tmdb_get(f"/movie/{movie_id}", {"language": "en-US"})
    return TMDBMovieDetails(
        tmdb_id=data["id"],
        title=data.get("title", ""),
        overview=data.get("overview"),
        release_date=data.get("release_date"),
        poster_url=make_img_url(data.get("poster_path")),
        backdrop_url=make_img_url(data.get("backdrop_path")),
        genres=data.get("genres", []),
    )

async def tmdb_search(query: str):
    return await tmdb_get(
        "/search/movie",
        {"query": query, "include_adult": "false", "language": "en-US", "page": 1},
    )

async def tmdb_search_first(query: str):
    data = await tmdb_search(query)
    results = data.get("results", [])
    return results[0] if results else None

async def tmdb_card_from_title(title: str) -> Optional[TMDBMovieCard]:
    try:
        m = await tmdb_search_first(title)
        if not m:
            return None
        return TMDBMovieCard(
            tmdb_id=m["id"],
            title=m.get("title") or title,
            poster_url=make_img_url(m.get("poster_path")),
            release_date=m.get("release_date"),
            vote_average=m.get("vote_average"),
        )
    except:
        return None

# ========= RECOMMENDERS =========
def tfidf_recommend(title: str, top_n: int = 10):
    key = norm_title(title)
    if key not in indices:
        return []
    idx = indices[key]
    qv = tfidf_matrix[idx]
    scores = (tfidf_matrix @ qv.T).toarray().ravel()
    order = np.argsort(-scores)
    recs = []
    for i in order:
        if i == idx: continue
        recs.append((df.iloc[i]["title"], float(scores[i])))
        if len(recs) == top_n:
            break
    return recs

def hybrid_recommend(title: str, top_n=10):
    key = norm_title(title)
    if key not in indices:
        return []
    idx = indices[key]
    query_mood = df.iloc[idx].get("mood", None)
    query_topic = df.iloc[idx].get("topic_id", None)
    qv = tfidf_matrix[idx]
    scores = (tfidf_matrix @ qv.T).toarray().ravel()
    results = []
    for i, score in enumerate(scores):
        if i == idx: continue
        mood_match = (df.iloc[i].get("mood") == query_mood)
        topic_match = (df.iloc[i].get("topic_id") == query_topic)
        final_score = score * (1.25 if mood_match else 1.0) * (1.25 if topic_match else 1.0)
        results.append((df.iloc[i]["title"], float(final_score), mood_match, topic_match))
    results = sorted(results, key=lambda x: x[1], reverse=True)
    return results[:top_n]

# ========= LOAD ON STARTUP =========
@app.on_event("startup")
def load_models():
    global df, tfidf_matrix, tfidf_obj, indices
    with open(DF_PATH, "rb") as f: df = pickle.load(f)
    with open(TFIDF_MATRIX_PATH, "rb") as f: tfidf_matrix = pickle.load(f)
    with open(TFIDF_PATH, "rb") as f: tfidf_obj = pickle.load(f)
    with open(INDICES_PATH, "rb") as f:
        raw = pickle.load(f)
        indices = {norm_title(k): v for k, v in raw.items()}
    print("Models loaded successfully!")

# ========= ROUTES =========
@app.get("/health")
def health(): return {"status": "ok"}

@app.get("/home", response_model=List[TMDBMovieCard])
async def home(category: str = "popular", limit: int = 20):
    data = await tmdb_get(f"/movie/{category}", {"language": "en-US", "page": 1})
    out = []
    for m in data.get("results", [])[:limit]:
        out.append(
            TMDBMovieCard(
                tmdb_id=m["id"],
                title=m.get("title", ""),
                poster_url=make_img_url(m.get("poster_path")),
                release_date=m.get("release_date"),
                vote_average=m.get("vote_average"),
            )
        )
    return out

@app.get("/recommend/tfidf")
async def route_tfidf(title: str, top_n: int = 10):
    recs = tfidf_recommend(title, top_n)
    return [{"title": t, "score": s} for t, s in recs]

@app.get("/recommend/hybrid", response_model=List[HybridRecItem])
async def route_hybrid(title: str, top_n: int = 10):
    recs = hybrid_recommend(title, top_n)
    out = []
    for t, s, mm, tm in recs:
        card = await tmdb_card_from_title(t)
        out.append(HybridRecItem(title=t, score=s, mood_match=mm, topic_match=tm, tmdb=card))
    return out

@app.get("/movie/search", response_model=SearchBundleResponse)
async def movie_bundle(query: str, tfidf_top_n: int = 8, hybrid_top_n: int = 8, genre_limit: int = 8):
    best = await tmdb_search_first(query)
    if not best:
        raise HTTPException(status_code=404, detail="Movie not found in TMDB")
    details = await tmdb_movie_details(best["id"])
    title = details.title

    tfidf_raw = tfidf_recommend(title, tfidf_top_n) or tfidf_recommend(query, tfidf_top_n)
    hybrid_raw = hybrid_recommend(title, hybrid_top_n) or hybrid_recommend(query, hybrid_top_n)

    tfidf_items = []
    for t, s in tfidf_raw:
        card = await tmdb_card_from_title(t)
        tfidf_items.append(TFIDFRecItem(title=t, score=s, tmdb=card))

    hybrid_items = []
    for t, s, mm, tm in hybrid_raw:
        card = await tmdb_card_from_title(t)
        hybrid_items.append(HybridRecItem(title=t, score=s, mood_match=mm, topic_match=tm, tmdb=card))

    genre_recs = []
    if details.genres:
        gid = details.genres[0]["id"]
        data = await tmdb_get("/discover/movie", {"with_genres": gid, "language": "en-US", "sort_by": "popularity.desc", "page": 1})
        for m in data.get("results", [])[:genre_limit]:
            if m["id"] != details.tmdb_id:
                genre_recs.append(
                    TMDBMovieCard(
                        tmdb_id=m["id"],
                        title=m.get("title"),
                        poster_url=make_img_url(m.get("poster_path")),
                        release_date=m.get("release_date"),
                        vote_average=m.get("vote_average"),
                    )
                )

    return SearchBundleResponse(
        query=query,
        movie_details=details,
        tfidf_recommendations=tfidf_items,
        hybrid_recommendations=hybrid_items,
        genre_recommendations=genre_recs,
    )
