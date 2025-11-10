
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOllama } from "@langchain/ollama";
import { OllamaEmbeddings } from "@langchain/ollama";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//wrap local llm to langchain
const llm = new ChatOllama({
   model: "tinyllama",
});


const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://localhost:11434", 
});


const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex: index,
});

const retriever = vectorStore.asRetriever();

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
      const docs = await retriever.invoke(input.question);
      return docs.map((doc) => doc.pageContent).join("\n\n");
    },
  },
  prompt,
  llm,
  new StringOutputParser(),
]);

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
app.get("/", (req, res) => {
  res.send(" Backend running — use POST /query");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
