An intelligent Pet Assistant chatbot built using the MERN Stack, powered by Retrieval-Augmented Generation (RAG) architecture using LangChain, Ollama, and Pinecone.
The assistant helps users get accurate pet-care information by combining LLM responses with contextual knowledge retrieval.

🚀 Features
- AI-powered pet assistant chatbot
- Retrieval-Augmented Generation (RAG)
- Semantic search using vector embeddings
- Context-aware responses
-Pet care and health guidance
- Real-time conversational interface
- Fast vector retrieval with Pinecone
- Local LLM support using Ollama
- LangChain orchestration pipeline
-  MERN architecture
  
🛠️ Tech Stack
--Frontend
React.js
CSS3
Axios

--Backend
Node.js
Express.js

--AI & RAG
LangChain
Ollama
Pinecone Vector Database
Embedding Models

--Database
MongoDB

Create .env inside backend folder:

PINECONE_API_KEY=your_api_key
PINECONE_INDEX=your_index_name

OLLAMA_BASE_URL=http://localhost:11434
MODEL_NAME=tinyllama

1️⃣ Clone Repository
2️⃣ Install Dependencies
----Frontend
cd frontend
npm install
----Backend
cd ../backend
npm install

4️⃣ Run Ollama
Install Ollama and pull model:
ollama run llama3

5️⃣ Ingest Animal Data
node ingest.js

This uploads animal knowledge from animal.txt into Pinecone.

6️⃣ Start Backend
node query.js

7️⃣Start Frontend
npm run dev

Example Queries
“What do dogs eat?”
“How to take care of cats?”
"Wet foods for cats"
