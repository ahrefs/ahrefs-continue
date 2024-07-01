import * as fs from "fs";
import path from "path";
import {
  BrowserSerializedContinueConfig,
  Config,
  ContextProviderWithParams,
  ContinueConfig,
  ContinueRcJson,
  CustomContextProvider,
  CustomLLM,
  EmbeddingsProviderDescription,
  IContextProvider,
  IdeType,
  ModelDescription,
  Reranker,
  RerankerDescription,
  SerializedContinueConfig,
  SlashCommand,
  BaseCompletionOptions
} from "..";
import {
  slashCommandFromDescription,
  slashFromCustomCommand,
} from "../commands";
import { contextProviderClassFromName } from "../context/providers";
import CustomContextProviderClass from "../context/providers/CustomContextProvider";
import FileContextProvider from "../context/providers/FileContextProvider";
// import { AllRerankers } from "../context/rerankers";
// import { LLMReranker } from "../context/rerankers/llm";
import { AllEmbeddingsProviders } from "../indexing/embeddings";
import TransformersJsEmbeddingsProvider from "../indexing/embeddings/TransformersJsEmbeddingsProvider";
import { BaseLLM } from "../llm";
import { llmFromDescription } from "../llm/llms";
import CustomLLMClass from "../llm/llms/CustomLLM";
import { copyOf } from "../util";
import mergeJson from "../util/merge";
import {
  getConfigJsPath,
  getConfigJsonPath,
  getConfigTsPath,
  getContinueDotEnv,
  migrate,
} from "../util/paths";
import { editConfigJson } from "../util/paths";
const { execSync } = require("child_process");

function resolveSerializedConfig(filepath: string): SerializedContinueConfig {
  let content = fs.readFileSync(filepath, "utf8");
  let config = JSON.parse(content) as SerializedContinueConfig;
  if (config.env && Array.isArray(config.env)) {
    const env = {
      ...process.env,
      ...getContinueDotEnv(),
    };

    config.env.forEach((envVar) => {
      if (envVar in env) {
        content = content.replaceAll(
          new RegExp(`"${envVar}"`, "g"),
          `"${env[envVar]}"`,
        );
      }
    });
  }

  return JSON.parse(content);
}

async function fetchRemoteConfig(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

const configMergeKeys = {
  models: (a: any, b: any) => a.title === b.title,
  commandModels: (a: any, b: any) => a.title === b.title,
  tabAutocompleteModels: (a: any, b: any) => a.title === b.title,
};

async function loadSerializedConfig(
  workspaceConfigs: ContinueRcJson[],
  remoteConfigServerUrl: URL | undefined,
  ideType: IdeType,
): Promise<SerializedContinueConfig> {
  const configPath = getConfigJsonPath(ideType);
  let config: SerializedContinueConfig;
  try {
    config = resolveSerializedConfig(configPath);
  } catch (e) {
    throw new Error(`Failed to parse config.json: ${e}`);
  }

  if (config.allowAnonymousTelemetry === undefined) {
    config.allowAnonymousTelemetry = true;
  }

  migrate("codeContextProvider", () => {
    if (!config.contextProviders?.filter((cp) => cp.name === "code")?.length) {
      config.contextProviders = [
        ...(config.contextProviders || []),
        {
          name: "code",
          params: {},
        },
      ];
    }

    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 2), "utf8");
  });

  migrate("docsContextProvider1", () => {
    if (!config.contextProviders?.filter((cp) => cp.name === "docs")?.length) {
      config.contextProviders = [
        ...(config.contextProviders || []),
        {
          name: "docs",
          params: {},
        },
      ];
    }

    fs.writeFileSync(configPath, JSON.stringify(config, undefined, 2), "utf8");
  });

  if (remoteConfigServerUrl) {
    const remoteConfigJson = await fetchRemoteConfig(remoteConfigServerUrl.href);
    config = mergeJson(config, remoteConfigJson, "merge", configMergeKeys);

    // Force it to generate line by line
    if (config.tabAutocompleteOptions) {
        config.tabAutocompleteOptions.multilineCompletions = "never";
    } else {
        config.tabAutocompleteOptions = { multilineCompletions: "never" };
    }
  }

  for (const workspaceConfig of workspaceConfigs) {
    config = mergeJson(
      config,
      workspaceConfig,
      workspaceConfig.mergeBehavior,
      configMergeKeys,
    );
  }
  return config;
}

function serializedToIntermediateConfig(
  initial: SerializedContinueConfig,
): Config {
  const slashCommands: SlashCommand[] = [];
  for (const command of initial.slashCommands || []) {
    const newCommand = slashCommandFromDescription(command);
    if (newCommand) {
      slashCommands.push(newCommand);
    }
  }
  for (const command of initial.customCommands || []) {
    slashCommands.push(slashFromCustomCommand(command));
  }

  const config: Config = {
    ...initial,
    slashCommands,
    contextProviders: initial.contextProviders || [],
  };

  return config;
}

function isModelDescription(
  llm: ModelDescription | CustomLLM,
): llm is ModelDescription {
  return (llm as ModelDescription).title !== undefined;
}

function isContextProviderWithParams(
  contextProvider: CustomContextProvider | ContextProviderWithParams,
): contextProvider is ContextProviderWithParams {
  return (contextProvider as ContextProviderWithParams).name !== undefined;
}

async function loadModels(models: (CustomLLM | ModelDescription)[], readFile: (filepath: string) => Promise<string>, completionOptions?: BaseCompletionOptions, systemMessage?: string): Promise<BaseLLM[]> {
  const loaded: BaseLLM[] = [];
  for (const desc of models) {
    if (isModelDescription(desc)) {
      const llm = await llmFromDescription(
        desc,
        readFile,
        completionOptions,
        systemMessage,
      );
      if (!llm) continue;

      if (llm.model === "AUTODETECT") {
        try {
          const modelNames = await llm.listModels();
          const detectedModels = await Promise.all(
            modelNames.map(async (modelName) => {
              return await llmFromDescription(
                {
                  ...desc,
                  model: modelName,
                  title: llm.title + " - " + modelName,
                },
                readFile,
                copyOf(completionOptions),
                systemMessage,
              );
            }),
          );
          loaded.push(
            ...(detectedModels.filter(
              (x) => typeof x !== "undefined",
            ) as BaseLLM[]),
          );
        } catch (e) {
          console.warn("Error listing models: ", e);
        }
      } else {
        loaded.push(llm);
      }
    } else {
      const llm = new CustomLLMClass(desc);
      if (llm.model === "AUTODETECT") {
        try {
          const modelNames = await llm.listModels();
          const models = modelNames.map(
            (modelName) =>
              new CustomLLMClass({
                ...desc,
                options: { ...desc.options, model: modelName },
              }),
          );

          models.push(...models);
        } catch (e) {
          console.warn("Error listing models: ", e);
        }
      } else {
        loaded.push(llm);
      }
    }
  }
  return loaded;
}

/** Only difference between intermediate and final configs is the `models` array */
async function intermediateToFinalConfig(
  config: Config,
  readFile: (filepath: string) => Promise<string>,
): Promise<ContinueConfig> {
  const models: BaseLLM[] = await loadModels(config.models, readFile, config.completionOptions, config.systemMessage);
  const commandModels: BaseLLM[] = await loadModels(config.commandModels, readFile, config.completionOptions, config.systemMessage);

  if (!commandModels) {
    throw new Error("Failed to initialize command model");
  }

  const autocompleteLlms: BaseLLM[] = await loadModels(config.tabAutocompleteModels, readFile, config.completionOptions, config.systemMessage);

  const contextProviders: IContextProvider[] = [new FileContextProvider({})];
  for (const provider of config.contextProviders || []) {
    if (isContextProviderWithParams(provider)) {
      const cls = contextProviderClassFromName(provider.name) as any;
      if (!cls) {
        console.warn(`Unknown context provider ${provider.name}`);
        continue;
      }
      contextProviders.push(new cls(provider.params));
    } else {
      contextProviders.push(new CustomContextProviderClass(provider));
    }
  }

  // // Embeddings Provider
  // if (
  //   (config.embeddingsProvider as EmbeddingsProviderDescription | undefined)
  //     ?.provider
  // ) {
  //   const { provider, ...options } =
  //     config.embeddingsProvider as EmbeddingsProviderDescription;
  //   config.embeddingsProvider = new AllEmbeddingsProviders[provider](options);
  // }

  // if (!config.embeddingsProvider) {
  //   config.embeddingsProvider = new TransformersJsEmbeddingsProvider();
  // }

  // // Reranker
  // if (config.reranker && !(config.reranker as Reranker | undefined)?.rerank) {
  //   const { name, params } = config.reranker as RerankerDescription;
  //   const rerankerClass = AllRerankers[name];

  //   if (name === "llm") {
  //     const llm = models.find((model) => model.title === params?.modelTitle);
  //     if (!llm) {
  //       console.warn(`Unknown model ${params?.modelTitle}`);
  //     } else {
  //       config.reranker = new LLMReranker(llm);
  //     }
  //   } else if (rerankerClass) {
  //     config.reranker = new rerankerClass(params);
  //   }
  // }

  return {
    ...config,
    commandModels,
    contextProviders,
    models,
    embeddingsProvider: config.embeddingsProvider as any,
    tabAutocompleteModels: autocompleteLlms,
    reranker: config.reranker as any,
  };
}

function finalToBrowserConfig(
  final: ContinueConfig,
): BrowserSerializedContinueConfig {
  return {
    allowAnonymousTelemetry: final.allowAnonymousTelemetry,
    models: final.models.map((m) => ({
      provider: m.providerName,
      model: m.model,
      title: m.title ?? m.model,
      apiKey: m.apiKey,
      apiBase: m.apiBase,
      contextLength: m.contextLength,
      template: m.template,
      completionOptions: m.completionOptions,
      systemMessage: m.systemMessage,
      requestOptions: m.requestOptions,
      // TODO: Types incompanitable. Correct them.
      // promptTemplates: m.promptTemplates,
    })),
    systemMessage: final.systemMessage,
    completionOptions: final.completionOptions,
    slashCommands: final.slashCommands?.map((m) => ({
      name: m.name,
      description: m.description,
      options: m.params,
    })),
    contextProviders: final.contextProviders?.map((c) => c.description),
    disableIndexing: final.disableIndexing,
    disableSessionTitles: final.disableSessionTitles,
    userToken: final.userToken,
    embeddingsProvider: final.embeddingsProvider?.id,
    ui: final.ui,
  };
}

function getTarget() {
  const os =
    {
      aix: "linux",
      darwin: "darwin",
      freebsd: "linux",
      linux: "linux",
      openbsd: "linux",
      sunos: "linux",
      win32: "win32",
    }[process.platform as string] ?? "linux";
  const arch = {
    arm: "arm64",
    arm64: "arm64",
    ia32: "x64",
    loong64: "arm64",
    mips: "arm64",
    mipsel: "arm64",
    ppc: "x64",
    ppc64: "x64",
    riscv64: "arm64",
    s390: "x64",
    s390x: "x64",
    x64: "x64",
  }[process.arch];

  return `${os}-${arch}`;
}

function escapeSpacesInPath(p: string): string {
  return p.replace(/ /g, "\\ ");
}

async function buildConfigTs() {
  if (!fs.existsSync(getConfigTsPath())) {
    return undefined;
  }

  try {
    if (process.env.IS_BINARY === "true") {
      execSync(
        escapeSpacesInPath(path.dirname(process.execPath)) +
        `/esbuild${getTarget().startsWith("win32") ? ".exe" : ""
        } ${escapeSpacesInPath(
          getConfigTsPath(),
        )} --bundle --outfile=${escapeSpacesInPath(
          getConfigJsPath(),
        )} --platform=node --format=cjs --sourcemap --external:fetch --external:fs --external:path --external:os --external:child_process`,
      );
    } else {
      // Dynamic import esbuild so potentially disastrous errors can be caught
      const esbuild = require("esbuild");

      await esbuild.build({
        entryPoints: [getConfigTsPath()],
        bundle: true,
        platform: "node",
        format: "cjs",
        outfile: getConfigJsPath(),
        external: ["fetch", "fs", "path", "os", "child_process"],
        sourcemap: true,
      });
    }
  } catch (e) {
    console.log(
      "Build error. Please check your ~/.continue/config.ts file: " + e,
    );
    return undefined;
  }

  if (!fs.existsSync(getConfigJsPath())) {
    return undefined;
  }
  return fs.readFileSync(getConfigJsPath(), "utf8");
}

async function loadFullConfigNode(
  readFile: (filepath: string) => Promise<string>,
  workspaceConfigs: ContinueRcJson[],
  remoteConfigServerUrl: URL | undefined,
  ideType: IdeType,
): Promise<ContinueConfig> {
  let serialized = await loadSerializedConfig(
    workspaceConfigs,
    remoteConfigServerUrl,
    ideType,
  );

  editConfigJson((input) => {
    return serialized
  })

  let intermediate = serializedToIntermediateConfig(serialized);

  const configJsContents = await buildConfigTs();
  if (configJsContents) {
    try {
      // Try config.ts first
      const configJsPath = getConfigJsPath();
      const module = await require(configJsPath);
      delete require.cache[require.resolve(configJsPath)];
      if (!module.modifyConfig) {
        throw new Error("config.ts does not export a modifyConfig function.");
      }
      intermediate = module.modifyConfig(intermediate);
    } catch (e) {
      console.log("Error loading config.ts: ", e);
    }
  }

  // Remote config.js
  // if (remoteConfigServerUrl) {
  //   try {
  //     const configJsPathForRemote = getConfigJsPathForRemote(
  //       remoteConfigServerUrl,
  //     );
  //     const module = await require(configJsPathForRemote);
  //     delete require.cache[require.resolve(configJsPathForRemote)];
  //     if (!module.modifyConfig) {
  //       throw new Error("config.ts does not export a modifyConfig function.");
  //     }
  //     intermediate = module.modifyConfig(intermediate);
  //   } catch (e) {
  //     console.log("Error loading remotely set config.js: ", e);
  //   }
  // }

  const finalConfig = await intermediateToFinalConfig(intermediate, readFile);
  return finalConfig;
}

export {
  finalToBrowserConfig,
  intermediateToFinalConfig,
  loadFullConfigNode,
  serializedToIntermediateConfig,
  type BrowserSerializedContinueConfig,
};
