<<<<<<< HEAD
import { Chunk, ChunkWithoutID } from "../..";
import { MAX_CHUNK_SIZE } from "../../llm/constants";
import { countTokens } from "../../llm/countTokens";
import { supportedLanguages } from "../../util/treeSitter";
import { basicChunker } from "./basic";
import { codeChunker } from "./code";
=======
import { Chunk, ChunkWithoutID } from "../../index.js";
import { countTokens } from "../../llm/countTokens.js";
import { supportedLanguages } from "../../util/treeSitter.js";
import { basicChunker } from "./basic.js";
import { codeChunker } from "./code.js";
>>>>>>> v0.9.184-vscode

async function* chunkDocumentWithoutId(
  filepath: string,
  contents: string,
  maxChunkSize: number,
): AsyncGenerator<ChunkWithoutID> {
  if (contents.trim() === "") {
    return;
  }

  const segs = filepath.split(".");
  const ext = segs[segs.length - 1];
  if (ext in supportedLanguages) {
    try {
      for await (const chunk of codeChunker(filepath, contents, maxChunkSize)) {
        yield chunk;
      }
      return;
    } catch (e) {
      // console.error(`Failed to parse ${filepath}: `, e);
      // falls back to basicChunker
    }
  }

  yield* basicChunker(contents, maxChunkSize);
}

export async function* chunkDocument(
  filepath: string,
  contents: string,
  maxChunkSize: number,
  digest: string,
): AsyncGenerator<Chunk> {
  let index = 0;
<<<<<<< HEAD
  for await (let chunkWithoutId of chunkDocumentWithoutId(
=======
  for await (const chunkWithoutId of chunkDocumentWithoutId(
>>>>>>> v0.9.184-vscode
    filepath,
    contents,
    maxChunkSize,
  )) {
<<<<<<< HEAD
    if (countTokens(chunkWithoutId.content) > MAX_CHUNK_SIZE) {
=======
    if (countTokens(chunkWithoutId.content) > maxChunkSize) {
>>>>>>> v0.9.184-vscode
      console.warn(
        `Chunk with more than ${maxChunkSize} tokens constructed: `,
        filepath,
        countTokens(chunkWithoutId.content),
      );
      continue;
    }
    yield {
      ...chunkWithoutId,
      digest,
      index,
      filepath,
    };
    index++;
  }
}
