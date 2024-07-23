import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
<<<<<<< HEAD
import { Chunk } from "../..";
import { MAX_CHUNK_SIZE } from "../../llm/constants";
import { cleanFragment, cleanHeader } from "../chunk/markdown";
import { PageData } from "./crawl";
=======
import { Chunk } from "../../index.js";
import { cleanFragment, cleanHeader } from "../chunk/markdown.js";
import { PageData } from "./crawl.js";
>>>>>>> v0.9.184-vscode

export type ArticleComponent = {
  title: string;
  body: string;
};

export type Article = {
  url: string;
  subpath: string;
  title: string;
  article_components: ArticleComponent[];
};

function breakdownArticleComponent(
  url: string,
  article: ArticleComponent,
  subpath: string,
<<<<<<< HEAD
): Chunk[] {
  let chunks: Chunk[] = [];

  let lines = article.body.split("\n");
=======
  max_chunk_size: number,
): Chunk[] {
  const chunks: Chunk[] = [];

  const lines = article.body.split("\n");
>>>>>>> v0.9.184-vscode
  let startLine = 0;
  let endLine = 0;
  let content = "";
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
<<<<<<< HEAD
    let line = lines[i];
    if (content.length + line.length <= MAX_CHUNK_SIZE) {
      content += line + "\n";
=======
    const line = lines[i];
    if (content.length + line.length <= max_chunk_size) {
      content += `${line}\n`;
>>>>>>> v0.9.184-vscode
      endLine = i;
    } else {
      chunks.push({
        content: content.trim(),
        startLine: startLine,
        endLine: endLine,
        otherMetadata: {
          title: cleanHeader(article.title),
        },
        index: index,
        filepath: new URL(
<<<<<<< HEAD
          subpath + `#${cleanFragment(article.title)}`,
=======
          `${subpath}#${cleanFragment(article.title)}`,
>>>>>>> v0.9.184-vscode
          url,
        ).toString(),
        digest: subpath,
      });
<<<<<<< HEAD
      content = line + "\n";
=======
      content = `${line}\n`;
>>>>>>> v0.9.184-vscode
      startLine = i;
      endLine = i;
      index += 1;
    }
  }

  // Push the last chunk
  if (content) {
    chunks.push({
      content: content.trim(),
      startLine: startLine,
      endLine: endLine,
      otherMetadata: {
        title: cleanHeader(article.title),
      },
      index: index,
      filepath: new URL(
<<<<<<< HEAD
        subpath + `#${cleanFragment(article.title)}`,
=======
        `${subpath}#${cleanFragment(article.title)}`,
>>>>>>> v0.9.184-vscode
        url,
      ).toString(),
      digest: subpath,
    });
  }

  // Don't use small chunks. Probably they're a mistake. Definitely they'll confuse the embeddings model.
  return chunks.filter((c) => c.content.trim().length > 20);
}

<<<<<<< HEAD
export function chunkArticle(articleResult: Article): Chunk[] {
  let chunks: Chunk[] = [];

  for (let article of articleResult.article_components) {
    let articleChunks = breakdownArticleComponent(
      articleResult.url,
      article,
      articleResult.subpath,
=======
export function chunkArticle(
  articleResult: Article,
  maxChunkSize: number,
): Chunk[] {
  let chunks: Chunk[] = [];

  for (const article of articleResult.article_components) {
    const articleChunks = breakdownArticleComponent(
      articleResult.url,
      article,
      articleResult.subpath,
      maxChunkSize,
>>>>>>> v0.9.184-vscode
    );
    chunks = [...chunks, ...articleChunks];
  }

  return chunks;
}

function extractTitlesAndBodies(html: string): ArticleComponent[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const titles = Array.from(document.querySelectorAll("h2"));
  const result = titles.map((titleElement) => {
    const title = titleElement.textContent || "";
    let body = "";
    let nextSibling = titleElement.nextElementSibling;

    while (nextSibling && nextSibling.tagName !== "H2") {
      body += nextSibling.textContent || "";
      nextSibling = nextSibling.nextElementSibling;
    }

    return { title, body };
  });

  return result;
}

export function stringToArticle(
  url: string,
  html: string,
  subpath: string,
): Article | undefined {
  try {
    const dom = new JSDOM(html);
<<<<<<< HEAD
    let reader = new Readability(dom.window.document);
    let article = reader.parse();
=======
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
>>>>>>> v0.9.184-vscode

    if (!article) {
      return undefined;
    }

<<<<<<< HEAD
    let article_components = extractTitlesAndBodies(article.content);
=======
    const article_components = extractTitlesAndBodies(article.content);
>>>>>>> v0.9.184-vscode

    return {
      url,
      subpath,
      title: article.title,
      article_components,
    };
  } catch (err) {
    console.error("Error converting URL to article components", err);
    return undefined;
  }
}

export function pageToArticle(page: PageData): Article | undefined {
  try {
    return stringToArticle(page.url, page.html, page.path);
  } catch (err) {
    console.error("Error converting URL to article components", err);
    return undefined;
  }
}
