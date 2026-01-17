<img width="1221" height="638" alt="Screenshot 2026-01-17 231452" src="https://github.com/user-attachments/assets/1bc787c2-c92e-4c62-890e-f55bdfaaf792" /># 🎬 CineSuggest – Movie Recommendation System

CineSuggest is an intelligent movie recommendation platform that combines **NLP, Machine Learning, and Live TMDB data** to recommend movies based on:

✔ TF-IDF content similarity  
✔ Mood classification  
✔ Topic modeling (BERTopic)  
✔ Genre matching via TMDB API  

This ensures **relevant, personalized, and high-quality** recommendations rather than random suggestions.

---

## 🚀 Live Deployment

| Service | Platform |
|--------|----------|
| **Frontend** | Vercel |
| **Backend API** | Render |
| **TMDB Provider** | TMDB Movie API |

---

## 🧠 Recommendation Logic

CineSuggest uses a hybrid AI approach:

1. **TF-IDF Similarity**  
   Computes cosine similarity between movie plots.

2. **Mood Classification**  
   Uses NLP to classify movie emotion (`fear`, `joy`, `anger`, `sadness`, `disgust`, `surprise`, `neutral`).

3. **Topic Modeling (BERTopic)**  
   Groups movies by semantic themes using transformer embeddings.

4. **TMDB Genre Discovery**  
   Adds fresh & trending recommendations using TMDB's live dataset.

---

## 🏛️ System Architecture

```
┌──────────────────────────┐        ┌───────────────────────┐
│        Frontend          │  HTTP  │       Backend API      │
│ React + Tailwind + Tanstack + Axios ─────────▶│ FastAPI + ML + TMDB │
└──────────────────────────┘        └───────────┬───────────┘
                                                │
                                                │ (NLP/ML)
                                         ┌──────▼─────────────────────┐
                                         │   ML Pipeline (Local)      │
                                         │  • TF-IDF Matrix            │
                                         │  • BERTopic Topics          │
                                         │  • Mood Classification      │
                                         └──────┬─────────────────────┘
                                                │
                                          ┌─────▼────────┐
                                          │   TMDB API    │
                                          │ (Live Data)   │
                                          └───────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- React
- TailwindCSS
- TanStack Query
- Axios
- React Router

### **Backend**
- Python + FastAPI
- scikit-learn
- BERTopic
- httpx (Async)
- pandas / numpy
- uvicorn

### **External APIs**
- TMDB Movie API

---

## 📁 Folder Structure

```
CineSuggest/
│
├── frontend/               # React + Tailwind + Tanstack Query + Axios
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   
│   │   
│   │   └── App.tsx
│   └── ...
│
├── backend/                # FastAPI backend
│   ├── main.py
│   ├── models/
│   │   ├── df.pkl
│   │   ├── tfidf.pkl
│   │   ├── tfidf_matrix.pkl
│   │   └── indices.pkl
│   └── ...
│
└── README.md
```

---

## 🔌 API Endpoints (Backend)

### **Health Check**
```
GET /health
```

### **Home Feed**
```
GET /home?category=popular&limit=20
```

### **TMDB Search**
```
GET /tmdb/search?query=batman
```

### **TF-IDF Recommendations**
```
GET /recommend/tfidf?title=Interstellar&top_n=10
```

### **Genre Recommendations**
```
GET /recommend/genre?tmdb_id=19995&limit=10
```

### **Hybrid Movie Bundle**
```
GET /movie/search?query=avatar&tfidf_top_n=10&genre_limit=10
```

---

## 🧩 Environment Variables

### **Backend (.env)**
```
TMDB_API_KEY=your_tmdb_api_key
```

### **Frontend (.env)**
```
VITE_API_BASE_URL=https://your-render-backend-url
```

---

## 🧪 Running Local Development

### **Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🚢 Deployment Guide

### **Backend → Render**
1. Create new **Web Service**
2. Set build:
```
pip install -r requirements.txt
```
3. Set Start Command:
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```
4. Add environment variable:
```
TMDB_API_KEY=xxxxxx
```

### **Frontend → Vercel**
1. Connect repository
2. Add `.env`:
```
VITE_API_BASE_URL=https://your-render-url
```
3. Deploy 🎉
https://cinesuggest-chi.vercel.app/
---

## 🖼️ UI Preview (Screenshots)

Add images like:


```
![Uploading Screenshot 2026-01-17 231431.png…]()
![Uploading Screenshot 2026-01-17 231443.png…]()

![Uploading Screenshot 2026-01-17 231452.png…]()


```

---

## 🚧 Future Improvements
- Add collaborative filtering (user → user)
- Add user auth & profiles
- Add watch history → dynamic learning
- Add streaming platform availability
- Mobile UI optimization

---


---

## 💡 Contributors
Developed by Abhinav (YSNS Abhinav)



