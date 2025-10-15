import { Embeddings } from "@langchain/core/embeddings";

export class OllamaEmbeddings extends Embeddings {
  constructor({ model = "llama2", baseUrl = "http://localhost:11434" } = {}) {
    super();
    this.model = model;
    this.baseUrl = baseUrl;
  }

  async embedQuery(text) {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: this.model, prompt: text }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama embedding error: ${response.statusText} - ${errText}`);
    }

    const data = await response.json();
    return data.embedding;
  }

  async embedDocuments(texts) {
    return Promise.all(texts.map((text) => this.embedQuery(text)));
  }
}
