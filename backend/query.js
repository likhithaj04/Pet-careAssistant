// server.js (Backend - Node.js with Express and LangChain v0.2+)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === SETUP OpenAI and Pinecone ===
const llm = new ChatOllama({
   model: "tinyllama",
});

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", // Default Ollama server
});


const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
});

const retriever = vectorStore.asRetriever();

// === Build Chain using LangChain v0.2 approach ===
const prompt = ChatPromptTemplate.fromMessages([
  {
    role: "system",
    content:" You are a veterinary assistant. Answer the question based only on retrieved documents. List specific cat vaccines, the diseases they prevent, and recommended schedules. Do not include generic advice or vague statements."
  },
  {
    role: "user",
    content: "{context}\n\nQuestion: {question}"
  }
]);

const chain = RunnableSequence.from([
  {
    question: (input) => input.question,
    context: async (input) => {
      const docs = await retriever.getRelevantDocuments(input.question);
      return docs.map((doc) => doc.pageContent).join("\n\n");
    },
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

// === API Route ===
app.post("/query", async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await chain.invoke({ question });
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
