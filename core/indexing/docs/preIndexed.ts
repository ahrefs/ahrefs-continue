<<<<<<< HEAD
import { Chunk } from "../..";
import { addDocs } from "./db";
=======
import { Chunk } from "../../index.js";
>>>>>>> v0.9.184-vscode

const request = require("request");

export async function downloadFromS3(
  bucket: string,
  fileName: string,
  region: string,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let data = "";

    const download = request({
      url: `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`,
    });
    download.on("response", (response: any) => {
      if (response.statusCode !== 200) {
        reject(new Error("No body returned when downloading from S3 bucket"));
      }
    });

    download.on("error", (err: any) => {
      reject(err);
    });

    download.on("data", (chunk: any) => {
      data += chunk;
    });

    download.on("end", () => {
      resolve(data);
    });
  });
}

export interface SiteIndexingResults {
  chunks: (Chunk & { embedding: number[] })[];
  url: string;
  title: string;
}
<<<<<<< HEAD

export async function downloadPreIndexedDocs(
  embeddingsProviderId: string,
  title: string,
) {
  const data = await downloadFromS3(
    "continue-indexed-docs",
    `${embeddingsProviderId}/${title}`,
    "us-west-1",
  );
  const results = JSON.parse(data) as SiteIndexingResults;
  await addDocs(
    results.title,
    new URL(results.url),
    results.chunks,
    results.chunks.map((c) => c.embedding),
  );
}
=======
>>>>>>> v0.9.184-vscode
