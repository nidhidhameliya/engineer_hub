# 🧠 Engineering Intelligence Hub

A production-ready RAG (Retrieval-Augmented Generation) system for engineering teams. Ask questions across your entire engineering knowledge base — docs, code, runbooks, incident reports, and architecture diagrams.

![Engineer Hub](./docs/preview.png)

---

## ✨ Features

- 📄 **Document Ingestion** — PDF, DOCX, TXT, Markdown, JSON, CSV
- 🐙 **GitHub Repository Indexing** — Clone and index entire repos
- 🔍 **Hybrid Search** — Vector + BM25 keyword search with MMR re-ranking
- 💬 **Streaming Chat** — ChatGPT-style interface with real-time responses
- 📎 **Source Citations** — Every answer includes source files + confidence scores
- 🏗️ **Architecture Diagram Analysis** — Upload images, ask about services
- 🚨 **Incident Report Intelligence** — Query postmortems and runbooks
- 📊 **Admin Dashboard** — Monitor indexed documents and query stats

---

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- OpenAI API Key

### 1. Clone and configure

```bash
git clone <your-repo>
cd engineer_hub

cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Start everything

```bash
docker-compose up --build
```

### 3. Open the app

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ChromaDB**: http://localhost:8001

---

## 🛠️ Manual Development Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start ChromaDB (local)
# Or point CHROMA_HOST=localhost in .env

uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
engineer_hub/
├── backend/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── routers/
│   │   ├── upload.py        # POST /upload
│   │   ├── github.py        # POST /github-index
│   │   ├── chat.py          # POST /chat (SSE)
│   │   ├── sources.py       # GET /sources
│   │   └── stats.py         # GET /stats
│   ├── services/
│   │   ├── ingestion.py     # Text extraction
│   │   ├── chunking.py      # Document chunking
│   │   ├── embedding.py     # OpenAI embeddings
│   │   ├── retrieval.py     # Hybrid search
│   │   └── llm.py           # GPT-4o streaming
│   └── db/
│       ├── chroma.py        # ChromaDB client
│       └── stats_store.py   # Query stats
├── frontend/
│   ├── app/
│   │   ├── chat/            # Chat interface
│   │   ├── upload/          # Document upload
│   │   ├── github/          # GitHub indexing
│   │   └── admin/           # Dashboard
│   ├── components/
│   │   ├── chat/            # Chat components
│   │   ├── upload/          # Upload components
│   │   ├── admin/           # Admin components
│   │   └── layout/          # Sidebar, nav
│   ├── hooks/
│   │   └── useChat.ts
│   └── lib/
│       ├── api.ts
│       └── streaming.ts
├── sample-data/             # Example documents
├── uploads/                 # Uploaded files (gitignored)
├── vectorstore/             # ChromaDB data (gitignored)
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload and index documents |
| POST | `/github-index` | Index a GitHub repository |
| POST | `/chat` | Ask a question (SSE streaming) |
| GET | `/sources` | List all indexed sources |
| GET | `/stats` | System statistics |
| GET | `/health` | Health check |

---

## 💡 Example Usage

### Upload a document
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@sample-data/auth-service.md"
```

### Index a GitHub repo
```bash
curl -X POST http://localhost:8000/github-index \
  -H "Content-Type: application/json" \
  -d '{"repo_url": "https://github.com/your-org/your-repo"}'
```

### Ask a question
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How does authentication work?", "stream": false}'
```

***SCREENSHOTS:***

**Frontend**
\<img width="1919" height="1033" alt="Screenshot 2026-06-13 153953" src="https://github.com/user-attachments/assets/5309cee1-2d9e-4d81-a9a9-b3d22b2330f7" />
<img width="1918" height="988" alt="Screenshot 2026-06-13 154044" src="https://github.com/user-attachments/assets/8f3db1bc-1324-4126-9c8d-e07e206a1072" />
<img width="1916" height="942" alt="Screenshot 2026-06-13 154107" src="https://github.com/user-attachments/assets/352aac11-f9de-479d-8fb6-567d18ce3387" />

<img width="1919" height="1033" alt="Screenshot 2026-06-13 153929" src="https://github.com/user-attachments/assets/eedc616f-4fac-476d-a571-2cb64b5df52b" />


<img width="1919" height="1063" alt="Screenshot 2026-06-13 151943" src="https://github.com/user-attachments/assets/e0916cfa-086c-408f-a260-08481ac7bfe4" />
<img width="1919" height="1039" alt="Screenshot 2026-06-13 154117" src="https://github.com/user-attachments/assets/5e764615-d98f-413c-b37f-7d16124ca1e3" />

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | Your OpenAI API key |
| `GITHUB_TOKEN` | ❌ | GitHub PAT for private repos |
| `CHROMA_HOST` | ❌ | ChromaDB host (default: localhost) |
| `CHROMA_PORT` | ❌ | ChromaDB port (default: 8000) |
| `LOG_LEVEL` | ❌ | Logging level (default: INFO) |

---

