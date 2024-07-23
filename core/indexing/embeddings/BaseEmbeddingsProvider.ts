import {
  EmbedOptions,
  EmbeddingsProvider,
  FetchFunction,
} from "../../index.js";

<<<<<<< HEAD
=======
import { MAX_CHUNK_SIZE } from "../../llm/constants.js";

>>>>>>> v0.9.184-vscode
export interface IBaseEmbeddingsProvider extends EmbeddingsProvider {
  options: EmbedOptions;
  fetch: FetchFunction;
  defaultOptions?: EmbedOptions;
  maxBatchSize?: number;
}

abstract class BaseEmbeddingsProvider implements IBaseEmbeddingsProvider {
  static maxBatchSize: IBaseEmbeddingsProvider["maxBatchSize"];
  static defaultOptions: IBaseEmbeddingsProvider["defaultOptions"];

  options: IBaseEmbeddingsProvider["options"];
  fetch: IBaseEmbeddingsProvider["fetch"];
  id: IBaseEmbeddingsProvider["id"];

  constructor(
    options: IBaseEmbeddingsProvider["options"],
    fetch: IBaseEmbeddingsProvider["fetch"],
  ) {
    // Overwrite default options with any runtime options
    this.options = {
      ...(this.constructor as typeof BaseEmbeddingsProvider).defaultOptions,
      ...options,
    };
    this.fetch = fetch;
<<<<<<< HEAD
    this.id = this.options.model || this.constructor.name;
=======
    // Include the `max_chunk_size` if it is not the default, since we need to create other indices for different chunk_sizes
    if (this.maxChunkSize !== MAX_CHUNK_SIZE) {
      this.id = `${this.constructor.name}::${this.options.model}::${this.maxChunkSize}`;
    } else {
      this.id = `${this.constructor.name}::${this.options.model}`;
    }
>>>>>>> v0.9.184-vscode
  }

  abstract embed(chunks: string[]): Promise<number[][]>;

<<<<<<< HEAD
=======
  get maxChunkSize(): number {
    return this.options.maxChunkSize ?? MAX_CHUNK_SIZE;
  }

>>>>>>> v0.9.184-vscode
  static getBatchedChunks(chunks: string[]): string[][] {
    if (!this.maxBatchSize) {
      console.warn(
        `${this.getBatchedChunks.name} should only be called if 'maxBatchSize' is defined`,
      );

      return [chunks];
    }

    if (chunks.length > this.maxBatchSize) {
      return [chunks];
    }

    const batchedChunks = [];

    for (let i = 0; i < chunks.length; i += this.maxBatchSize) {
      const batchSizedChunk = chunks.slice(i, i + this.maxBatchSize);
      batchedChunks.push(batchSizedChunk);
    }

    return batchedChunks;
  }
}

<<<<<<< HEAD
export default BaseEmbeddingsProvider;
=======
export default BaseEmbeddingsProvider;
>>>>>>> v0.9.184-vscode
