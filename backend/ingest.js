// backend/ingest.js
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Pinecone } from "@pinecone-database/pinecone";
import * as dotenv from "dotenv";

dotenv.config();

// 1. Load your text file
const loader = new TextLoader("animal_food.txt");
const docs = await loader.load();

// 2. Create local embedding using Ollama
const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", // Ollama default
});

// 3. Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.Index(process.env.PINECONE_INDEX);

// 4. Upload embedded docs to Pinecone
await PineconeStore.fromDocuments(docs, embeddings, {
  pineconeIndex: index,
});

console.log(" Documents successfully ingested into Pinecone!");
