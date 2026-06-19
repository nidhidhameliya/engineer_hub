# 🧠 Engineering Intelligence Hub

> AI-Powered Knowledge Intelligence Platform for Engineering Teams

![Engineering Intelligence Hub](./docs/preview.png)

## 👋 Welcome

Engineering Intelligence Hub is a production-ready Retrieval-Augmented Generation (RAG) platform designed specifically for modern software engineering organizations.

Engineering teams generate vast amounts of knowledge every day—architecture documents, runbooks, incident reports, technical specifications, GitHub repositories, postmortems, and internal documentation. Finding the right information at the right time often becomes a challenge.

This platform transforms your engineering knowledge base into an intelligent AI assistant that can answer questions instantly using your organization's own data.

Instead of manually searching through hundreds of documents and repositories, simply ask a question and receive accurate, source-grounded answers with citations.

---

# 🚀 What Does It Do?

Engineering Intelligence Hub allows teams to:

* Upload and index technical documents
* Analyze architecture diagrams using Vision AI
* Index entire GitHub repositories
* Query runbooks and incident reports
* Chat with your engineering knowledge base
* Receive answers with source citations
* Monitor usage through an admin dashboard

Every answer is generated from your indexed data, significantly reducing hallucinations and improving trustworthiness.

---

# ✨ Key Features

### 📄 Multi-Format Document Ingestion

Upload and index:

* PDF
* DOCX
* TXT
* Markdown
* JSON
* CSV

---

### 🖼️ Architecture Diagram Intelligence

Upload system diagrams and ask questions such as:

* "Which service handles authentication?"
* "What dependencies does the payment service have?"
* "Describe the request flow."

Powered by multimodal Vision AI.

---

### 🐙 GitHub Repository Indexing

Index complete repositories directly from GitHub.

The system automatically:

* Clones repositories
* Extracts source code
* Generates embeddings
* Makes code searchable through natural language

Example:

> "How is JWT authentication implemented in the backend?"

---

### 🔍 Hybrid Search Engine

Combines multiple retrieval strategies:

* Semantic Vector Search (ChromaDB)
* BM25 Keyword Search
* MMR Re-ranking (Maximal Marginal Relevance)

This dramatically improves retrieval quality compared to vector search alone.

---

### 💬 Streaming AI Chat

Modern ChatGPT-style interface featuring:

* Real-time response streaming
* Multi-turn conversations
* Context-aware answers
* Source-grounded generation

---

### 📎 Source Citations

Every generated response includes:

* Source document names
* Referenced files
* Confidence scores

Example:

```text
Authentication is handled by the Auth Service.

[SOURCE: auth-service.md]
Confidence: 94%
```

---

### 🧠 Conversation Memory

Maintain context across conversations.

Example:

```text
User:
How does authentication work?

Assistant:
...

User:
What database does it use?

Assistant:
(PostgreSQL, based on the Auth Service architecture.)
```

---

### 📊 Admin Dashboard

Monitor platform activity:

* Indexed document count
* Repository statistics
* Search analytics
* Query metrics
* Storage utilization

---

### 🐳 Dockerized Deployment

One-command deployment using Docker Compose.

Perfect for:

* Internal engineering tools
* Team knowledge portals
* Enterprise documentation systems

---

# 🏗️ System Architecture

```text
┌─────────────────┐
│   Next.js UI    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI API    │
└────────┬────────┘
         │
 ┌───────┼────────┐
 │       │        │
 ▼       ▼        ▼
LLM   Retrieval  Vision
(OpenAI) Engine   AI
         │
         ▼
┌─────────────────┐
│    ChromaDB     │
│ Vector Database │
└─────────────────┘
```

---

# 🛠️ Technology Stack

## Backend

* Python 3.10+
* FastAPI
* LangChain
* ChromaDB
* OpenAI SDK
* Structlog

---

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* Server-Sent Events (SSE)

---

## AI & Retrieval

* GPT-4o
* OpenAI Embeddings
* Chroma Vector Store
* BM25 Search
* MMR Re-ranking

---

# 🚀 Quick Start (Recommended)

## Prerequisites

* Docker
* Docker Compose
* OpenAI API Key

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-org/engineering-intelligence-hub.git

cd engineering-intelligence-hub
```

---

## 2. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
OPENAI_API_KEY=sk-your-api-key

# Optional
GITHUB_TOKEN=your-github-token
CHROMA_HOST=chromadb
CHROMA_PORT=8000
LOG_LEVEL=INFO
```

---

## 3. Start the Application

```bash
docker-compose up -d --build
```

Docker will automatically:

* Build the frontend
* Build the backend
* Start ChromaDB
* Connect all services

---

## 4. Access the Platform

| Service           | URL                        |
| ----------------- | -------------------------- |
| Frontend          | http://localhost:3000      |
| Backend API       | http://localhost:8000      |
| API Documentation | http://localhost:8000/docs |
| ChromaDB          | http://localhost:8001      |

---

## Stop the Application

```bash
docker-compose down
```

---

# 💻 Local Development Setup

## Prerequisites

* Python 3.10+
* Node.js 18+
* npm

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will be available at:

```text
http://localhost:3000
```

---

# 📁 Project Structure

```text
engineering-intelligence-hub/
│
├── backend/
│   ├── routers/
│   ├── services/
│   ├── db/
│   ├── main.py
│   └── config.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   └── lib/
│
├── uploads/
├── vectorstore/
├── sample-data/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

# 🔌 API Endpoints

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/upload`       | Upload and index documents |
| POST   | `/github-index` | Index GitHub repositories  |
| POST   | `/chat`         | Query the knowledge base   |
| GET    | `/sources`      | List indexed sources       |
| GET    | `/stats`        | System statistics          |
| GET    | `/health`       | Health check               |

---

# 📚 Example Usage

## Upload a Document

```bash
curl -X POST http://localhost:8000/upload \
-F "file=@sample-data/auth-service.md"
```

---

## Index a GitHub Repository

```bash
curl -X POST http://localhost:8000/github-index \
-H "Content-Type: application/json" \
-d '{
  "repo_url": "https://github.com/company/backend"
}'
```

---

## Ask a Question

```bash
curl -X POST http://localhost:8000/chat \
-H "Content-Type: application/json" \
-d '{
  "question": "How does authentication work?",
  "stream": false
}'
```

---

# 🔐 Environment Variables

| Variable       | Required | Description                         |
| -------------- | -------- | ----------------------------------- |
| OPENAI_API_KEY | ✅        | OpenAI API Key                      |
| GITHUB_TOKEN   | ❌        | GitHub PAT for private repositories |
| CHROMA_HOST    | ❌        | ChromaDB host                       |
| CHROMA_PORT    | ❌        | ChromaDB port                       |
| LOG_LEVEL      | ❌        | Logging level                       |

---

# 🎯 Use Cases

### Engineering Teams

* Internal documentation assistant
* Architecture exploration
* Runbook intelligence
* Incident analysis

### DevOps Teams

* Query operational runbooks
* Analyze outages and postmortems
* Infrastructure knowledge retrieval

### Platform Teams

* Service dependency discovery
* Codebase exploration
* Technical onboarding

### Enterprise Organizations

* Private AI knowledge assistant
* Secure internal search
* Team productivity enhancement

---

# 🔮 Future Roadmap

* Slack Integration
* Microsoft Teams Integration
* Jira Knowledge Indexing
* Confluence Integration
* RBAC & Multi-Tenant Support
* Knowledge Graph Generation
* Local LLM Support (Ollama)
* Advanced Analytics Dashboard

---

# 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a Pull Request

---

# 📄 License

Licensed under the MIT License.

---

## ⭐ Engineering Intelligence Hub

**Turn engineering knowledge into an intelligent AI assistant.**

Upload. Index. Ask. Learn.
