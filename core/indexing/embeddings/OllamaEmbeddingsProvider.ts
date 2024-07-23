import { EmbedOptions, FetchFunction } from "../../index.js";
import { withExponentialBackoff } from "../../util/withExponentialBackoff.js";
import BaseEmbeddingsProvider, {
  IBaseEmbeddingsProvider,
} from "./BaseEmbeddingsProvider.js";

async function embedOne(
  chunk: string,
  options: EmbedOptions,
  customFetch: FetchFunction,
) {
<<<<<<< HEAD
  const fetchWithBackoff = () =>
    withExponentialBackoff<Response>(() =>
      customFetch(new URL("api/embeddings", options.apiBase), {
        method: "POST",
        body: JSON.stringify({
          model: options.model,
          prompt: chunk,
        }),
      }),
    );
  const resp = await fetchWithBackoff();

  if (!resp.ok) {
    throw new Error(`Failed to embed chunk: ${await resp.text()}`);
  }

  return (await resp.json()).embedding;
=======
  const embedding = await withExponentialBackoff<number[]>(async () => {
    const resp = await customFetch(new URL("api/embeddings", options.apiBase), {
      method: "POST",
      body: JSON.stringify({
        model: options.model,
        prompt: chunk,
      }),
    });

    if (!resp.ok) {
      throw new Error(`Failed to embed chunk: ${await resp.text()}`);
    }

    const data = await resp.json();
    const embedding = data.embedding;

    if (!embedding || embedding.length === 0) {
      throw new Error("Ollama generated empty embedding");
    }
    return embedding;
  });

  return embedding;
>>>>>>> v0.9.184-vscode
}

class OllamaEmbeddingsProvider extends BaseEmbeddingsProvider {
  static defaultOptions: IBaseEmbeddingsProvider["defaultOptions"] = {
    apiBase: "http://localhost:11434/",
    model: "nomic-embed-text",
  };

  async embed(chunks: string[]) {
    const results: any = [];
    for (const chunk of chunks) {
      results.push(await embedOne(chunk, this.options, this.fetch));
    }
    return results;
  }
}

<<<<<<< HEAD
export default OllamaEmbeddingsProvider;
=======
export default OllamaEmbeddingsProvider;
>>>>>>> v0.9.184-vscode
