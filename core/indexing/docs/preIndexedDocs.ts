<<<<<<< HEAD
export interface SiteIndexingConfig {
  startUrl: string;
  title: string;
  rootUrl: string;
}
=======
import { SiteIndexingConfig } from "../../index.js";
>>>>>>> v0.9.184-vscode

const configs: SiteIndexingConfig[] = [
  {
    title: "Jinja",
    startUrl: "https://jinja.palletsprojects.com/en/3.1.x/",
    rootUrl: "https://jinja.palletsprojects.com/en/3.1.x/",
<<<<<<< HEAD
=======
    faviconUrl: "https://jinja.palletsprojects.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "React",
    startUrl: "https://react.dev/reference/",
    rootUrl: "https://react.dev/reference/",
<<<<<<< HEAD
=======
    faviconUrl: "https://react.dev/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "PostHog",
    startUrl: "https://posthog.com/docs",
    rootUrl: "https://posthog.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://posthog.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Express",
    startUrl: "https://expressjs.com/en/5x/api.html",
    rootUrl: "https://expressjs.com/en/5x/",
<<<<<<< HEAD
=======
    faviconUrl: "https://expressjs.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "OpenAI",
    startUrl: "https://platform.openai.com/docs/",
    rootUrl: "https://platform.openai.com/docs/",
<<<<<<< HEAD
=======
    faviconUrl: "https://platform.openai.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Prisma",
    startUrl: "https://www.prisma.io/docs",
    rootUrl: "https://www.prisma.io/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://www.prisma.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Boto3",
    startUrl:
      "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html",
    rootUrl: "https://boto3.amazonaws.com/v1/documentation/api/latest/",
<<<<<<< HEAD
=======
    faviconUrl: "https://boto3.amazonaws.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Pytorch",
    startUrl: "https://pytorch.org/docs/stable/",
    rootUrl: "https://pytorch.org/docs/stable/",
<<<<<<< HEAD
=======
    faviconUrl: "https://pytorch.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Redis",
    startUrl: "https://redis.io/docs/",
    rootUrl: "https://redis.io/docs/",
<<<<<<< HEAD
=======
    faviconUrl: "https://redis.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Axios",
    startUrl: "https://axios-http.com/docs/intro",
    rootUrl: "https://axios-http.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://axios-http.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Redwood JS",
    startUrl: "https://redwoodjs.com/docs/introduction",
    rootUrl: "https://redwoodjs.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://redwoodjs.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "GraphQL",
    startUrl: "https://graphql.org/learn/",
    rootUrl: "https://graphql.org/learn/",
<<<<<<< HEAD
=======
    faviconUrl: "https://graphql.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Typescript",
    startUrl: "https://www.typescriptlang.org/docs/",
    rootUrl: "https://www.typescriptlang.org/docs/",
<<<<<<< HEAD
=======
    faviconUrl: "https://www.typescriptlang.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Jest",
    startUrl: "https://jestjs.io/docs/getting-started",
    rootUrl: "https://jestjs.io/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://jestjs.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Tailwind CSS",
    startUrl: "https://tailwindcss.com/docs/installation",
    rootUrl: "https://tailwindcss.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://tailwindcss.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Vue.js",
    startUrl: "https://vuejs.org/guide/introduction.html",
    rootUrl: "https://vuejs.org",
<<<<<<< HEAD
=======
    faviconUrl: "https://vuejs.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Svelte",
    startUrl: "https://svelte.dev/docs/introduction",
    rootUrl: "https://svelte.dev/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://svelte.dev/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "GitHub Actions",
    startUrl: "https://docs.github.com/en/actions",
    rootUrl: "https://docs.github.com/en/actions",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.github.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "NodeJS",
    startUrl: "https://nodejs.org/docs/latest/api/",
    rootUrl: "https://nodejs.org/docs/latest/api/",
<<<<<<< HEAD
=======
    faviconUrl: "https://nodejs.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Socket.io",
    startUrl: "https://socket.io/docs/v4/",
    rootUrl: "https://socket.io/docs/v4/",
<<<<<<< HEAD
=======
    faviconUrl: "https://socket.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Gradle",
    startUrl: "https://docs.gradle.org/current/userguide/userguide.html",
    rootUrl: "https://docs.gradle.org/current",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.gradle.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Redux Toolkit",
    startUrl: "https://redux-toolkit.js.org/introduction/getting-started",
    rootUrl: "https://redux-toolkit.js.org",
<<<<<<< HEAD
=======
    faviconUrl: "https://redux-toolkit.js.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Chroma",
    startUrl: "https://docs.trychroma.com/",
    rootUrl: "https://docs.trychroma.com/",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.trychroma.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "SQLite",
    startUrl: "https://www.sqlite.org/docs.html",
    rootUrl: "https://www.sqlite.org",
<<<<<<< HEAD
=======
    faviconUrl: "https://www.sqlite.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Redux",
    startUrl: "https://redux.js.org/introduction/getting-started",
    rootUrl: "https://redux.js.org",
<<<<<<< HEAD
=======
    faviconUrl: "https://redux.js.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Prettier",
    startUrl: "https://prettier.io/docs/en/",
    rootUrl: "https://prettier.io/docs/en/",
<<<<<<< HEAD
=======
    faviconUrl: "https://prettier.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "VS Code Extension API",
    startUrl: "https://code.visualstudio.com/api",
    rootUrl: "https://code.visualstudio.com/api",
<<<<<<< HEAD
  },
  {
    title: "Continue",
    startUrl: "https://continue.dev/docs/intro",
    rootUrl: "https://continue.dev/docs",
=======
    faviconUrl: "https://code.visualstudio.com/favicon.ico",
  },
  {
    title: "Continue",
    startUrl: "https://docs.continue.dev/intro",
    rootUrl: "https://docs.continue.dev",
    faviconUrl: "https://docs.continue.dev/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "jQuery",
    startUrl: "https://api.jquery.com/",
    rootUrl: "https://api.jquery.com/",
<<<<<<< HEAD
=======
    faviconUrl: "https://api.jquery.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Python",
    startUrl: "https://docs.python.org/3/",
    rootUrl: "https://docs.python.org/3/",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.python.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Rust",
    startUrl: "https://doc.rust-lang.org/book/",
    rootUrl: "https://doc.rust-lang.org/book/",
<<<<<<< HEAD
=======
    faviconUrl: "https://doc.rust-lang.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "IntelliJ Platform SDK",
    startUrl: "https://plugins.jetbrains.com/docs/intellij/welcome.html",
    rootUrl: "https://plugins.jetbrains.com/docs/intellij",
<<<<<<< HEAD
=======
    faviconUrl: "https://plugins.jetbrains.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Docker",
    startUrl: "https://docs.docker.com/",
    rootUrl: "https://docs.docker.com/",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.docker.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "NPM",
    startUrl: "https://docs.npmjs.com/",
    rootUrl: "https://docs.npmjs.com/",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.npmjs.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "TipTap",
    startUrl: "https://tiptap.dev/docs/editor/introduction",
    rootUrl: "https://tiptap.dev/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://tiptap.dev/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "esbuild",
    startUrl: "https://esbuild.github.io/",
    rootUrl: "https://esbuild.github.io/",
<<<<<<< HEAD
=======
    faviconUrl: "https://esbuild.github.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Tree Sitter",
    startUrl: "https://tree-sitter.github.io/tree-sitter/",
    rootUrl: "https://tree-sitter.github.io/tree-sitter/",
<<<<<<< HEAD
=======
    faviconUrl: "https://tree-sitter.github.io/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Netlify",
    startUrl: "https://docs.netlify.com/",
    rootUrl: "https://docs.netlify.com/",
<<<<<<< HEAD
=======
    faviconUrl: "https://docs.netlify.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Replicate",
    startUrl: "https://replicate.com/docs",
    rootUrl: "https://replicate.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://replicate.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "HTML",
    startUrl: "https://www.w3schools.com/html/default.asp",
    rootUrl: "https://www.w3schools.com/html",
<<<<<<< HEAD
=======
    faviconUrl: "https://www.w3schools.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "CSS",
    startUrl: "https://www.w3schools.com/css/default.asp",
    rootUrl: "https://www.w3schools.com/css",
<<<<<<< HEAD
=======
    faviconUrl: "https://www.w3schools.com/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
  {
    title: "Langchain",
    startUrl: "https://python.langchain.com/docs/get_started/introduction",
    rootUrl: "https://python.langchain.com/docs",
<<<<<<< HEAD
=======
    faviconUrl: "https://python.langchain.com/favicon.ico",
  },
  {
    title: "WooCommerce",
    startUrl: "https://developer.woocommerce.com/docs/",
    rootUrl: "https://developer.woocommerce.com/docs/",
    faviconUrl: "https://developer.woocommerce.com/favicon.ico",
  },
  {
    title: "WordPress",
    startUrl: "https://developer.wordpress.org/reference/",
    rootUrl: "https://developer.wordpress.org/reference/",
    faviconUrl: "https://developer.wordpress.org/favicon.ico",
  },
  {
    title: "PySide6",
    startUrl: "https://doc.qt.io/qtforpython-6/quickstart.html",
    rootUrl: "https://doc.qt.io/qtforpython-6/api.html",
    faviconUrl: "https://doc.qt.io/favicon.ico",
  },
  {
    title: "Bootstrap",
    startUrl: "https://getbootstrap.com/docs/5.3/getting-started/introduction/",
    rootUrl: "https://getbootstrap.com/docs/5.3/",
    faviconUrl: "https://getbootstrap.com/favicon.ico",
  },
  {
    title: "Alpine.js",
    startUrl: "https://alpinejs.dev/start-here",
    rootUrl: "https://alpinejs.dev/",
    faviconUrl: "https://alpinejs.dev/favicon.ico",
  },
  {
    title: "C# Language Reference",
    startUrl: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    rootUrl: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    faviconUrl: "https://learn.microsoft.com/favicon.ico",
  },
  {
    title: "Godot",
    startUrl: "https://docs.godotengine.org/en/latest/",
    rootUrl: "https://docs.godotengine.org/en/latest/",
    faviconUrl: "https://godotengine.org/favicon.ico",
>>>>>>> v0.9.184-vscode
  },
];

export default configs;
