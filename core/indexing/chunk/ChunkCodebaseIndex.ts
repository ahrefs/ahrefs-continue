<<<<<<< HEAD
import { Chunk, IndexTag, IndexingProgressUpdate } from "../..";
import { ContinueServerClient } from "../../continueServer/stubs/client";
import { MAX_CHUNK_SIZE } from "../../llm/constants";
import { getBasename } from "../../util";
import { DatabaseConnection, SqliteDb, tagToString } from "../refreshIndex";
import {
  CodebaseIndex,
  IndexResultType,
  MarkCompleteCallback,
  RefreshIndexResults,
} from "../types";
import { chunkDocument } from "./chunk";

export class ChunkCodebaseIndex implements CodebaseIndex {
  static artifactId: string = "chunks";
=======
import { IContinueServerClient } from "../../continueServer/interface.js";
import { Chunk, IndexTag, IndexingProgressUpdate } from "../../index.js";
import { getBasename } from "../../util/index.js";
import { DatabaseConnection, SqliteDb, tagToString } from "../refreshIndex.js";
import {
  IndexResultType,
  MarkCompleteCallback,
  RefreshIndexResults,
  type CodebaseIndex,
} from "../types.js";
import { chunkDocument } from "./chunk.js";

export class ChunkCodebaseIndex implements CodebaseIndex {
  relativeExpectedTime: number = 1;
  static artifactId = "chunks";
>>>>>>> v0.9.184-vscode
  artifactId: string = ChunkCodebaseIndex.artifactId;

  constructor(
    private readonly readFile: (filepath: string) => Promise<string>,
<<<<<<< HEAD
    private readonly continueServerClient?: ContinueServerClient,
=======
    private readonly continueServerClient: IContinueServerClient,
    private readonly maxChunkSize: number
>>>>>>> v0.9.184-vscode
  ) {
    this.readFile = readFile;
  }

  private async _createTables(db: DatabaseConnection) {
    await db.exec(`CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cacheKey TEXT NOT NULL,
      path TEXT NOT NULL,
      idx INTEGER NOT NULL,
      startLine INTEGER NOT NULL,
      endLine INTEGER NOT NULL,
      content TEXT NOT NULL
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS chunk_tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        chunkId INTEGER NOT NULL,
        FOREIGN KEY (chunkId) REFERENCES chunks (id)
    )`);
  }

  async *update(
    tag: IndexTag,
    results: RefreshIndexResults,
    markComplete: MarkCompleteCallback,
    repoName: string | undefined,
  ): AsyncGenerator<IndexingProgressUpdate, any, unknown> {
    const db = await SqliteDb.get();
    await this._createTables(db);
    const tagString = tagToString(tag);

    async function handleChunk(chunk: Chunk) {
      const { lastID } = await db.run(
<<<<<<< HEAD
        `INSERT INTO chunks (cacheKey, path, idx, startLine, endLine, content) VALUES (?, ?, ?, ?, ?, ?)`,
=======
        "INSERT INTO chunks (cacheKey, path, idx, startLine, endLine, content) VALUES (?, ?, ?, ?, ?, ?)",
>>>>>>> v0.9.184-vscode
        [
          chunk.digest,
          chunk.filepath,
          chunk.index,
          chunk.startLine,
          chunk.endLine,
          chunk.content,
        ],
      );

<<<<<<< HEAD
      await db.run(`INSERT INTO chunk_tags (chunkId, tag) VALUES (?, ?)`, [
=======
      await db.run("INSERT INTO chunk_tags (chunkId, tag) VALUES (?, ?)", [
>>>>>>> v0.9.184-vscode
        lastID,
        tagString,
      ]);
    }

    // Check the remote cache
<<<<<<< HEAD
    if (this.continueServerClient !== undefined) {
=======
    if (this.continueServerClient.connected) {
>>>>>>> v0.9.184-vscode
      try {
        const keys = results.compute.map(({ cacheKey }) => cacheKey);
        const resp = await this.continueServerClient.getFromIndexCache(
          keys,
          "chunks",
          repoName,
        );

        for (const [cacheKey, chunks] of Object.entries(resp.files)) {
          for (const chunk of chunks) {
            await handleChunk(chunk);
          }
        }
        results.compute = results.compute.filter(
          (item) => !resp.files[item.cacheKey],
        );
      } catch (e) {
        console.error("Failed to fetch from remote cache: ", e);
      }
    }

<<<<<<< HEAD
=======
    const progressReservedForTagging = 0.3;
    let accumulatedProgress = 0;

>>>>>>> v0.9.184-vscode
    // Compute chunks for new files
    const contents = await Promise.all(
      results.compute.map(({ path }) => this.readFile(path)),
    );
    for (let i = 0; i < results.compute.length; i++) {
      const item = results.compute[i];

      // Insert chunks
<<<<<<< HEAD
      for await (let chunk of chunkDocument(
        item.path,
        contents[i],
        MAX_CHUNK_SIZE,
=======
      for await (const chunk of chunkDocument(
        item.path,
        contents[i],
        this.maxChunkSize,
>>>>>>> v0.9.184-vscode
        item.cacheKey,
      )) {
        handleChunk(chunk);
      }

<<<<<<< HEAD
      yield {
        progress: i / results.compute.length,
=======
      accumulatedProgress =
        (i / results.compute.length) * (1 - progressReservedForTagging);
      yield {
        progress: accumulatedProgress,
>>>>>>> v0.9.184-vscode
        desc: `Chunking ${getBasename(item.path)}`,
        status: "indexing",
      };
      markComplete([item], IndexResultType.Compute);
    }

    // Add tag
    for (const item of results.addTag) {
      const chunksWithPath = await db.all(
<<<<<<< HEAD
        `SELECT * FROM chunks WHERE cacheKey = ?`,
=======
        "SELECT * FROM chunks WHERE cacheKey = ?",
>>>>>>> v0.9.184-vscode
        [item.cacheKey],
      );

      for (const chunk of chunksWithPath) {
<<<<<<< HEAD
        await db.run(`INSERT INTO chunk_tags (chunkId, tag) VALUES (?, ?)`, [
=======
        await db.run("INSERT INTO chunk_tags (chunkId, tag) VALUES (?, ?)", [
>>>>>>> v0.9.184-vscode
          chunk.id,
          tagString,
        ]);
      }

      markComplete([item], IndexResultType.AddTag);
<<<<<<< HEAD
=======
      accumulatedProgress += 1 / results.addTag.length / 4;
      yield {
        progress: accumulatedProgress,
        desc: `Chunking ${getBasename(item.path)}`,
        status: "indexing",
      };
>>>>>>> v0.9.184-vscode
    }

    // Remove tag
    for (const item of results.removeTag) {
      await db.run(
        `
        DELETE FROM chunk_tags
        WHERE tag = ?
          AND chunkId IN (
            SELECT id FROM chunks
            WHERE cacheKey = ? AND path = ?
          )
      `,
        [tagString, item.cacheKey, item.path],
      );
      markComplete([item], IndexResultType.RemoveTag);
<<<<<<< HEAD
=======
      accumulatedProgress += 1 / results.removeTag.length / 4;
      yield {
        progress: accumulatedProgress,
        desc: `Removing ${getBasename(item.path)}`,
        status: "indexing",
      };
>>>>>>> v0.9.184-vscode
    }

    // Delete
    for (const item of results.del) {
<<<<<<< HEAD
      const deleted = await db.run(`DELETE FROM chunks WHERE cacheKey = ?`, [
=======
      const deleted = await db.run("DELETE FROM chunks WHERE cacheKey = ?", [
>>>>>>> v0.9.184-vscode
        item.cacheKey,
      ]);

      // Delete from chunk_tags
<<<<<<< HEAD
      await db.run(`DELETE FROM chunk_tags WHERE chunkId = ?`, [
=======
      await db.run("DELETE FROM chunk_tags WHERE chunkId = ?", [
>>>>>>> v0.9.184-vscode
        deleted.lastID,
      ]);

      markComplete([item], IndexResultType.Delete);
<<<<<<< HEAD
=======
      accumulatedProgress += 1 / results.del.length / 4;
      yield {
        progress: accumulatedProgress,
        desc: `Removing ${getBasename(item.path)}`,
        status: "indexing",
      };
>>>>>>> v0.9.184-vscode
    }
  }
}
