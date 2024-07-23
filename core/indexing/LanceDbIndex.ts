// NOTE: vectordb requirement must be listed in extensions/vscode to avoid error
import { v4 as uuidv4 } from "uuid";
import { Table } from "vectordb";
<<<<<<< HEAD
=======
import { IContinueServerClient } from "../continueServer/interface.js";
>>>>>>> v0.9.184-vscode
import {
  BranchAndDir,
  Chunk,
  EmbeddingsProvider,
  IndexTag,
  IndexingProgressUpdate,
<<<<<<< HEAD
} from "..";
import { ContinueServerClient } from "../continueServer/stubs/client";
import { MAX_CHUNK_SIZE } from "../llm/constants";
import { getBasename } from "../util";
import { getLanceDbPath } from "../util/paths";
import { chunkDocument } from "./chunk/chunk";
import { DatabaseConnection, SqliteDb, tagToString } from "./refreshIndex";
=======
} from "../index.js";
import { getBasename } from "../util/index.js";
import { getLanceDbPath, migrate } from "../util/paths.js";
import { chunkDocument } from "./chunk/chunk.js";
import { DatabaseConnection, SqliteDb, tagToString } from "./refreshIndex.js";
>>>>>>> v0.9.184-vscode
import {
  CodebaseIndex,
  IndexResultType,
  PathAndCacheKey,
  RefreshIndexResults,
<<<<<<< HEAD
} from "./types";
=======
} from "./types.js";
>>>>>>> v0.9.184-vscode

// LanceDB  converts to lowercase, so names must all be lowercase
interface LanceDbRow {
  uuid: string;
  path: string;
  cachekey: string;
  vector: number[];
  [key: string]: any;
}

export class LanceDbIndex implements CodebaseIndex {
<<<<<<< HEAD
  get artifactId(): string {
    return "vectordb::" + this.embeddingsProvider.id;
  }

  static MAX_CHUNK_SIZE = MAX_CHUNK_SIZE;

  constructor(
    private readonly embeddingsProvider: EmbeddingsProvider,
    private readonly readFile: (filepath: string) => Promise<string>,
    private readonly continueServerClient?: ContinueServerClient,
  ) {}

  private tableNameForTag(tag: IndexTag) {
    return tagToString(tag)
      .replace(/\//g, "")
      .replace(/\\/g, "")
      .replace(/\:/g, "");
=======
  relativeExpectedTime: number = 13;
  get artifactId(): string {
    return `vectordb::${this.embeddingsProvider.id}`;
  }

  constructor(
    private readonly embeddingsProvider: EmbeddingsProvider,
    private readonly readFile: (filepath: string) => Promise<string>,
    private readonly continueServerClient?: IContinueServerClient,
  ) {}

  private tableNameForTag(tag: IndexTag) {
    return tagToString(tag).replace(/[^\w-_.]/g, "");
>>>>>>> v0.9.184-vscode
  }

  private async createSqliteCacheTable(db: DatabaseConnection) {
    await db.exec(`CREATE TABLE IF NOT EXISTS lance_db_cache (
        uuid TEXT PRIMARY KEY,
        cacheKey TEXT NOT NULL,
        path TEXT NOT NULL,
<<<<<<< HEAD
=======
        artifact_id TEXT NOT NULL,
>>>>>>> v0.9.184-vscode
        vector TEXT NOT NULL,
        startLine INTEGER NOT NULL,
        endLine INTEGER NOT NULL,
        contents TEXT NOT NULL
    )`);
<<<<<<< HEAD
=======

    await new Promise((resolve) =>
      migrate(
        "lancedb_sqlite_artifact_id_column",
        async () => {
          try {
            await db.exec(
              "ALTER TABLE lance_db_cache ADD COLUMN artifact_id TEXT NOT NULL DEFAULT 'UNDEFINED'",
            );
          } finally {
            resolve(undefined);
          }
        },
        () => resolve(undefined),
      ),
    );
>>>>>>> v0.9.184-vscode
  }

  private async *computeChunks(
    items: PathAndCacheKey[],
  ): AsyncGenerator<
    | [
        number,
        LanceDbRow,
        { startLine: number; endLine: number; contents: string },
        string,
      ]
    | PathAndCacheKey
  > {
    const contents = await Promise.all(
      items.map(({ path }) => this.readFile(path)),
    );

    for (let i = 0; i < items.length; i++) {
      // Break into chunks
      const content = contents[i];
      const chunks: Chunk[] = [];

<<<<<<< HEAD
      for await (let chunk of chunkDocument(
        items[i].path,
        content,
        LanceDbIndex.MAX_CHUNK_SIZE,
        items[i].cacheKey,
      )) {
        chunks.push(chunk);
      }

=======
      let hasEmptyChunks = false;

      for await (const chunk of chunkDocument(
        items[i].path,
        content,
        this.embeddingsProvider.maxChunkSize,
        items[i].cacheKey,
      )) {
        if (chunk.content.length == 0) {
          hasEmptyChunks = true;
          break;
        }
        chunks.push(chunk);
      }

      if (hasEmptyChunks) {
        // File did not chunk properly, let's skip it.
        continue;
      }

>>>>>>> v0.9.184-vscode
      if (chunks.length > 20) {
        // Too many chunks to index, probably a larger file than we want to include
        continue;
      }

<<<<<<< HEAD
      // Calculate embeddings
      const embeddings = await this.embeddingsProvider.embed(
        chunks.map((c) => c.content),
      );
=======
      let embeddings: number[][];
      try {
        // Calculate embeddings
        embeddings = await this.embeddingsProvider.embed(
          chunks.map((c) => c.content),
        );
      } catch (e) {
        // Rather than fail the entire indexing process, we'll just skip this file
        // so that it may be picked up on the next indexing attempt
        console.warn(
          `Failed to generate embedding for ${chunks[0]?.filepath} with provider: ${this.embeddingsProvider.id}: ${e}`,
        );
        continue;
      }

      if (embeddings.some((emb) => emb === undefined)) {
        throw new Error(
          `Failed to generate embedding for ${chunks[0]?.filepath} with provider: ${this.embeddingsProvider.id}`,
        );
      }
>>>>>>> v0.9.184-vscode

      // Create row format
      for (let j = 0; j < chunks.length; j++) {
        const progress = (i + j / chunks.length) / items.length;
        const row = {
          vector: embeddings[j],
          path: items[i].path,
          cachekey: items[i].cacheKey,
          uuid: uuidv4(),
        };
        const chunk = chunks[j];
        yield [
          progress,
          row,
          {
            contents: chunk.content,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
          },
          `Indexing ${getBasename(chunks[j].filepath)}`,
        ];
      }

      yield items[i];
    }
  }

  async *update(
    tag: IndexTag,
    results: RefreshIndexResults,
    markComplete: (
      items: PathAndCacheKey[],
      resultType: IndexResultType,
    ) => void,
    repoName: string | undefined,
  ): AsyncGenerator<IndexingProgressUpdate> {
    const lancedb = await import("vectordb");
    const tableName = this.tableNameForTag(tag);
    const db = await lancedb.connect(getLanceDbPath());

    const sqlite = await SqliteDb.get();
    await this.createSqliteCacheTable(sqlite);

    // Compute
    let table: Table<number[]> | undefined = undefined;
<<<<<<< HEAD
    let needToCreateTable = true;
    const existingTables = await db.tableNames();
=======
    const existingTables = await db.tableNames();
    let needToCreateTable = !existingTables.includes(tableName);
>>>>>>> v0.9.184-vscode

    const addComputedLanceDbRows = async (
      pathAndCacheKey: PathAndCacheKey,
      computedRows: LanceDbRow[],
    ) => {
      // Create table if needed, add computed rows
      if (table) {
        if (computedRows.length > 0) {
          await table.add(computedRows);
        }
      } else if (existingTables.includes(tableName)) {
        table = await db.openTable(tableName);
        needToCreateTable = false;
        if (computedRows.length > 0) {
          await table.add(computedRows);
        }
      } else if (computedRows.length > 0) {
        table = await db.createTable(tableName, computedRows);
        needToCreateTable = false;
      }

      // Mark item complete
      markComplete([pathAndCacheKey], IndexResultType.Compute);
    };

    // Check remote cache
<<<<<<< HEAD
    if (this.continueServerClient !== undefined) {
=======
    if (this.continueServerClient?.connected) {
>>>>>>> v0.9.184-vscode
      try {
        const keys = results.compute.map(({ cacheKey }) => cacheKey);
        const resp = await this.continueServerClient.getFromIndexCache(
          keys,
          "embeddings",
          repoName,
        );
        for (const [cacheKey, chunks] of Object.entries(resp.files)) {
          // Get path for cacheKey
          const path = results.compute.find(
            (item) => item.cacheKey === cacheKey,
          )?.path;
          if (!path) {
            console.warn(
              "Continue server sent a cacheKey that wasn't requested",
              cacheKey,
            );
            continue;
          }

          // Build LanceDbRow objects
          const rows: LanceDbRow[] = [];
          for (const chunk of chunks) {
            const row = {
              path,
              cachekey: cacheKey,
              uuid: uuidv4(),
              vector: chunk.vector,
            };
            rows.push(row);

            await sqlite.run(
<<<<<<< HEAD
              "INSERT INTO lance_db_cache (uuid, cacheKey, path, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?)",
              row.uuid,
              row.cachekey,
              row.path,
=======
              "INSERT INTO lance_db_cache (uuid, cacheKey, path, artifact_id, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              row.uuid,
              row.cachekey,
              row.path,
              this.artifactId,
>>>>>>> v0.9.184-vscode
              JSON.stringify(row.vector),
              chunk.startLine,
              chunk.endLine,
              chunk.contents,
            );
          }

          await addComputedLanceDbRows({ cacheKey, path }, rows);
        }

        // Remove items that don't need to be recomputed
        results.compute = results.compute.filter(
          (item) => !resp.files[item.cacheKey],
        );
      } catch (e) {
        console.log("Error checking remote cache: ", e);
      }
    }

<<<<<<< HEAD
=======
    const progressReservedForTagging = 0.1;
    let accumulatedProgress = 0;

>>>>>>> v0.9.184-vscode
    let computedRows: LanceDbRow[] = [];
    for await (const update of this.computeChunks(results.compute)) {
      if (Array.isArray(update)) {
        const [progress, row, data, desc] = update;
        computedRows.push(row);

        // Add the computed row to the cache
        await sqlite.run(
<<<<<<< HEAD
          "INSERT INTO lance_db_cache (uuid, cacheKey, path, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?)",
          row.uuid,
          row.cachekey,
          row.path,
=======
          "INSERT INTO lance_db_cache (uuid, cacheKey, path, artifact_id, vector, startLine, endLine, contents) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          row.uuid,
          row.cachekey,
          row.path,
          this.artifactId,
>>>>>>> v0.9.184-vscode
          JSON.stringify(row.vector),
          data.startLine,
          data.endLine,
          data.contents,
        );

<<<<<<< HEAD
        yield { progress, desc, status: "indexing" };
=======
        accumulatedProgress = progress * (1 - progressReservedForTagging);
        yield {
          progress: accumulatedProgress,
          desc,
          status: "indexing",
        };
>>>>>>> v0.9.184-vscode
      } else {
        await addComputedLanceDbRows(update, computedRows);
        computedRows = [];
      }
    }

    // Add tag - retrieve the computed info from lance sqlite cache
<<<<<<< HEAD
    for (let { path, cacheKey } of results.addTag) {
      const stmt = await sqlite.prepare(
        "SELECT * FROM lance_db_cache WHERE cacheKey = ? AND path = ?",
        cacheKey,
        path,
=======
    for (const { path, cacheKey } of results.addTag) {
      const stmt = await sqlite.prepare(
        "SELECT * FROM lance_db_cache WHERE cacheKey = ? AND path = ? AND artifact_id = ?",
        cacheKey,
        path,
        this.artifactId,
>>>>>>> v0.9.184-vscode
      );
      const cachedItems = await stmt.all();

      const lanceRows: LanceDbRow[] = cachedItems.map((item) => {
        return {
          path,
          cachekey: cacheKey,
          uuid: item.uuid,
          vector: JSON.parse(item.vector),
        };
      });

<<<<<<< HEAD
      if (needToCreateTable && lanceRows.length > 0) {
        table = await db.createTable(tableName, lanceRows);
        needToCreateTable = false;
      } else if (lanceRows.length > 0) {
        await table!.add(lanceRows);
      }

      markComplete([{ path, cacheKey }], IndexResultType.AddTag);
=======
      if (lanceRows.length > 0) {
        if (needToCreateTable) {
          table = await db.createTable(tableName, lanceRows);
          needToCreateTable = false;
        } else if (!table) {
          table = await db.openTable(tableName);
          needToCreateTable = false;
          await table.add(lanceRows);
        } else {
          await table?.add(lanceRows);
        }
      }

      markComplete([{ path, cacheKey }], IndexResultType.AddTag);
      accumulatedProgress += 1 / results.addTag.length / 3;
      yield {
        progress: accumulatedProgress,
        desc: `Indexing ${getBasename(path)}`,
        status: "indexing",
      };
>>>>>>> v0.9.184-vscode
    }

    // Delete or remove tag - remove from lance table)
    if (!needToCreateTable) {
<<<<<<< HEAD
      for (let { path, cacheKey } of [...results.removeTag, ...results.del]) {
        // This is where the aforementioned lowercase conversion problem shows
        await table!.delete(`cachekey = '${cacheKey}' AND path = '${path}'`);
=======
      const toDel = [...results.removeTag, ...results.del];
      for (const { path, cacheKey } of toDel) {
        // This is where the aforementioned lowercase conversion problem shows
        await table?.delete(`cachekey = '${cacheKey}' AND path = '${path}'`);

        accumulatedProgress += 1 / toDel.length / 3;
        yield {
          progress: accumulatedProgress,
          desc: `Stashing ${getBasename(path)}`,
          status: "indexing",
        };
>>>>>>> v0.9.184-vscode
      }
    }
    markComplete(results.removeTag, IndexResultType.RemoveTag);

    // Delete - also remove from sqlite cache
<<<<<<< HEAD
    for (let { path, cacheKey } of results.del) {
      await sqlite.run(
        "DELETE FROM lance_db_cache WHERE cacheKey = ? AND path = ?",
        cacheKey,
        path,
      );
=======
    for (const { path, cacheKey } of results.del) {
      await sqlite.run(
        "DELETE FROM lance_db_cache WHERE cacheKey = ? AND path = ? AND artifact_id = ?",
        cacheKey,
        path,
        this.artifactId,
      );
      accumulatedProgress += 1 / results.del.length / 3;
      yield {
        progress: accumulatedProgress,
        desc: `Removing ${getBasename(path)}`,
        status: "indexing",
      };
>>>>>>> v0.9.184-vscode
    }

    markComplete(results.del, IndexResultType.Delete);
    yield {
      progress: 1,
      desc: "Completed Calculating Embeddings",
      status: "done",
    };
  }

  private async _retrieveForTag(
    tag: IndexTag,
    n: number,
    directory: string | undefined,
    vector: number[],
    db: any, /// lancedb.Connection
  ): Promise<LanceDbRow[]> {
    const tableName = this.tableNameForTag(tag);
    const tableNames = await db.tableNames();
    if (!tableNames.includes(tableName)) {
<<<<<<< HEAD
=======
      console.warn("Table not found in LanceDB", tableName);
>>>>>>> v0.9.184-vscode
      return [];
    }

    const table = await db.openTable(tableName);
    let query = table.search(vector);
    if (directory) {
      // seems like lancedb is only post-filtering, so have to return a bunch of results and slice after
      query = query.where(`path LIKE '${directory}%'`).limit(300);
    } else {
      query = query.limit(n);
    }
    const results = await query.execute();
    return results.slice(0, n) as any;
  }

  async retrieve(
    query: string,
    n: number,
    tags: BranchAndDir[],
    filterDirectory: string | undefined,
  ): Promise<Chunk[]> {
    const lancedb = await import("vectordb");
    if (!lancedb.connect) {
      throw new Error("LanceDB failed to load a native module");
    }
    const [vector] = await this.embeddingsProvider.embed([query]);
    const db = await lancedb.connect(getLanceDbPath());

    let allResults = [];
    for (const tag of tags) {
      const results = await this._retrieveForTag(
        { ...tag, artifactId: this.artifactId },
        n,
        filterDirectory,
        vector,
        db,
      );
      allResults.push(...results);
    }

    allResults = allResults
      .sort((a, b) => a._distance - b._distance)
      .slice(0, n);

    const sqliteDb = await SqliteDb.get();
    const data = await sqliteDb.all(
      `SELECT * FROM lance_db_cache WHERE uuid in (${allResults
        .map((r) => `'${r.uuid}'`)
        .join(",")})`,
    );

    return data.map((d) => {
      return {
        digest: d.cacheKey,
        filepath: d.path,
        startLine: d.startLine,
        endLine: d.endLine,
        index: 0,
        content: d.contents,
      };
    });
  }
}
