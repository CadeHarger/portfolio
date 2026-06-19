Link to repo: 
https://github.com/CadeHarger/Cathode

# Cathode

Turn a life experience into a cathartic playlist! Cathode finds songs with similar/emotionally cathartic lyrics to your input. 

`Cath(arsis) + Ode`

This project was created by Cade Harger (myself) in fall 2025 A) because it's a cool project I wanted to use myself and B) because I wanted to teach myself how to vibe code better and understand just how far I could push the models.

Looking back on it from mid-2026, it's amazing how far we've come. Generated backend code is much cleaner now, the frontend would be unrecognizably better if done today, and I would've done this project in a day (instead of about a 2-3 weeks, after work). 

I learned a lot about vibe coding as I'd intended, and I really started to see the power of agents and how vector search combined with an LLM result-checker (RAG) was a powerful pattern. It was very satisfying to see how fast I went from idea to working prototype. I also was learning about GCP around this time, so I wanted to architect my first deployment and potentially share this app with my LinkedIn network. I ultimately decided against it after seeing the price tag for running these ML flows with some level of concurrent users. I learned a lot about cloud deployment doing that, and which services are for what. 

## How it works

Gemini generates Spotify queries, candidate tracks are matched against a local lyrics corpus (~3M songs after filtering for duplicates/English), FAISS vector search ranks by semantic similarity, and Gemini re-ranks using full lyrics.

**Stack:** React + Vite frontend · FastAPI backend · FAISS · SentenceTransformers · Spotipy · Gemini

## Setup

**Prerequisites:** Python 3.10+, Node.js, [Spotify](https://developer.spotify.com/dashboard/applications) + [Gemini](https://aistudio.google.com/apikey) API keys, and the lyrics dataset (not in repo — see below).

```bash
# Backend (use a venv — avoids torch/torchvision version conflicts in global Python)
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
cp .env.example .env          # SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, GEMINI_API_KEY
pip install -r requirements.txt
python start_server.py        # http://localhost:8000

# Frontend (separate terminal)
cd cathode-frontend
npm install
npm run dev                   # http://localhost:5173
```

For data-prep scripts: `pip install -r requirements-dev.txt` from `backend/`.

## Data (required to run)

`backend/data/` and `backend/models/` are gitignored. Download [Genius Song Lyrics](https://www.kaggle.com/datasets/carlosgdcj/genius-song-lyrics-with-language-information), place `song_lyrics.csv` in `backend/data/`, then from `backend/`:

```bash
python modify/split_song_lyrics_into_chunks.py
python modify/get_embeds.py
# optional: python modify/finetune_embeds.py  →  models/mpnet_lyrics_lora/epoch_1/
```

Without the finetuned model, the API falls back to `all-mpnet-base-v2`. The full dataset needs several GB of RAM at startup.

## Commands

| Command | Purpose |
|---------|---------|
| `python start_server.py` | API for the React app |
| `python hybrid_agent.py` | Interactive CLI |
| `npm run build` (frontend) | Production build → `dist/` |

`archive/` holds abandoned GCP deployment code and a legacy prototype — not maintained.


# Cathode Architecture

## Current (local)

Single-machine stack. The React app polls a FastAPI job API; the backend runs the full playlist pipeline in-process.

```mermaid
flowchart LR
  user[User] --> fe[React SPA]
  fe -->|POST /api/playlist| api[FastAPI]
  fe -->|poll GET /api/job/id| api
  api --> pipeline[Hybrid search pipeline]
  pipeline --> gemini1[Gemini: query gen]
  pipeline --> spotify[Spotify API]
  pipeline --> faiss[FAISS + DataManager]
  pipeline --> gemini2[Gemini: lyric rerank]
  faiss --> data["backend/data/ chunks"]
  gemini2 --> lyrics["song_lyrics_chunk_*.csv"]
```

**Pipeline steps**

1. Gemini generates Spotify playlist search queries from the user's experience + genre filters.
2. Spotify returns candidate tracks; matches are found in the local lyrics metadata corpus.
3. User prompt is embedded (finetuned mpnet or `all-mpnet-base-v2` fallback) and searched via in-memory FAISS.
4. Top vector hits are re-scored by Gemini using full lyrics (0.7 vector + 0.3 LLM, with a views popularity boost).

**Key components**

| Layer | Role |
|-------|------|
| `cathode-frontend/` | 3-step wizard, job polling, in-memory playlist state |
| `backend/api_server.py` | Async jobs, progress, cancellation |
| `backend/api_hybrid_agent.py` | Pipeline orchestration for the API |
| `backend/data_manager.py` | Loads embedding chunks into RAM, FAISS index, song lookup |
| `backend/hybrid_agent.py` | CLI variant (uses `VectorSearcher` instead of DataManager) |
| `backend/llm_filter.py` | On-demand lyrics load + Gemini scoring |

**Data** — Gitignored `backend/data/`: precomputed `embeddings_chunk_*.npy`, `other_columns_chunk_*.pkl`, `song_lyrics_chunk_*.csv`. Missing chunks are skipped with a warning; at least one complete chunk is required.

**Deploy today** — Frontend: Firebase Hosting (`dist/`). Backend: run locally or any host with the dataset + API keys on disk.

---

## Planned (cloud — archived, not implemented)

Abandoned budget GCP design. Code in `archive/cloud_deployment/` was a partial migration (GCS + BigQuery + Vertex AI) and is not maintained.

```mermaid
flowchart LR
  user[User] --> fe[Firebase Hosting]
  fe --> api[Cloud Run API]
  api --> queue[Cloud Tasks / Pub/Sub]
  queue --> worker[Cloud Run Job / Function]
  worker --> spotify[Spotify]
  worker --> gemini[Gemini]
  worker --> bq[BigQuery metadata]
  worker --> gcs[Cloud Storage embeddings]
  worker --> vec[Vector search]
  fe -->|poll| api
```

| Service | Purpose |
|---------|---------|
| Firebase Hosting | Static React app, CDN, SSL |
| Firebase Auth | User login (email/OAuth) — planned, not in current app |
| Cloud Run | Autoscaling API (scale to zero) |
| Cloud Run Jobs / Cloud Functions | Long-running playlist generation off the request path |
| Cloud Tasks / Pub/Sub | Job queue so users don't block on the pipeline |
| Cloud Storage | Embedding arrays, CSV artifacts |
| BigQuery | Lyrics metadata at scale (pay-per-query) |
| Vector search | pgvector in Cloud SQL, Pinecone/Weaviate, or BigQuery vector search |
| Vertex AI | Query embeddings (explored in archived `cathode_api`) |

**Planned flow** — User auth via Firebase → frontend calls Cloud Run API → API enqueues job → worker runs Spotify + vector search + LLM rerank → results stored in BigQuery/SQL → frontend polls for completion.

**Why deferred** — Cost and complexity vs. a portfolio/local demo; partial implementation duplicated the local API without finishing lyrics storage or job infrastructure.

See `archive/README.md` for what was archived and why.


## files

IconLogo.png - The icon logo for Cathode

Logo.png - Logo

Homepage.png - The landing page of Cathode

Step1InputPrompt.png - The first step, the user inputs their life experience

Step2Filters.png - The second step, the user selects filters (by genre and by exploration; how versatile of result songs they want)

Step3Loading.png - The loading page after submitting in step 2

ResultsPage.png - The results page showing the playlist of songs after step 3.