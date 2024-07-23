import { Response } from "node-fetch";
import { getHeaders } from "../../continueServer/stubs/headers.js";
<<<<<<< HEAD
import { EmbedOptions } from "../../index.js";
import { SERVER_URL } from "../../util/parameters.js";
=======
import { constants } from "../../deploy/constants.js";
import { EmbedOptions, FetchFunction } from "../../index.js";
>>>>>>> v0.9.184-vscode
import { withExponentialBackoff } from "../../util/withExponentialBackoff.js";
import BaseEmbeddingsProvider from "./BaseEmbeddingsProvider.js";

class FreeTrialEmbeddingsProvider extends BaseEmbeddingsProvider {
  static maxBatchSize = 128;

  static defaultOptions: Partial<EmbedOptions> | undefined = {
    model: "voyage-code-2",
  };

<<<<<<< HEAD
=======
  constructor(options: EmbedOptions, fetch: FetchFunction) {
    super(options, fetch);
    this.options.model = FreeTrialEmbeddingsProvider.defaultOptions?.model;
    this.id = `${this.constructor.name}::${this.options.model}`;
  }

>>>>>>> v0.9.184-vscode
  async embed(chunks: string[]) {
    const batchedChunks = [];
    for (
      let i = 0;
      i < chunks.length;
      i += FreeTrialEmbeddingsProvider.maxBatchSize
    ) {
      batchedChunks.push(
        chunks.slice(i, i + FreeTrialEmbeddingsProvider.maxBatchSize),
      );
    }
    return (
      await Promise.all(
        batchedChunks.map(async (batch) => {
<<<<<<< HEAD
          const fetchWithBackoff = () =>
            withExponentialBackoff<Response>(async () =>
              this.fetch(new URL("embeddings", SERVER_URL), {
=======
          if (batch.length === 0) {
            return [];
          }
          const fetchWithBackoff = () =>
            withExponentialBackoff<Response>(async () =>
              this.fetch(new URL("embeddings", constants.a), {
>>>>>>> v0.9.184-vscode
                method: "POST",
                body: JSON.stringify({
                  input: batch,
                  model: this.options.model,
                }),
                headers: {
                  "Content-Type": "application/json",
                  ...(await getHeaders()),
                },
              }),
            );
          const resp = await fetchWithBackoff();

          if (resp.status !== 200) {
            throw new Error(
              `Failed to embed: ${resp.status} ${await resp.text()}`,
            );
          }

          const data = (await resp.json()) as any;
          return data.embeddings;
        }),
      )
    ).flat();
  }
}

<<<<<<< HEAD
export default FreeTrialEmbeddingsProvider;
=======
export default FreeTrialEmbeddingsProvider;
>>>>>>> v0.9.184-vscode
