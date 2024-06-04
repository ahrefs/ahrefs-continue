import { SerializedContinueConfig } from "..";

export const defaultConfig: SerializedContinueConfig = {
  "models": [
    {
      "title": "DeepSeek-Coder-Base @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Base-Ahrefs",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "commandModels": [
    {
      "title": "DeepSeek-Coder-Base @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Base-Ahrefs",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "tabAutocompleteModels": [
    {
      "title": "DeepSeek-Coder-Finetuned @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Finetuned",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "tabAutocompleteOptions": {
    "template": "<｜fim▁begin｜>{{{prefix}}}<｜fim▁hole｜>{{{suffix}}}<｜fim▁end｜>",
    "useSuffix": true,
    "useCache": true,
    "multilineCompletions": "auto",
    "debounceDelay": 50,
    "onlyMyCode": true,
    "useOtherFiles": true,
    "maxPromptTokens": 2048
  },
  "disableIndexing": true,
  "slashCommands": [
    {
      "name": "edit",
      "description": "Edit selected code"
    },
    {
      "name": "comment",
      "description": "Write comments for the selected code"
    },
    {
      "name": "share",
      "description": "Download and share this session"
    },
    {
      "name": "cmd",
      "description": "Generate a shell command"
    }
  ],
  "customCommands": [
    {
      "name": "test",
      "prompt": "Write a comprehensive set of unit tests for the selected code. It should setup, run tests that check for correctness including important edge cases, and teardown. Ensure that the tests are complete and sophisticated. Give the tests just as chat output, don't edit any file.",
      "description": "Write unit tests for highlighted code"
    }
  ],
  "contextProviders": [
    {
      "name": "diff",
      "params": {}
    },
    {
      "name": "open",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    },
    {
      "name": "problems",
      "params": {}
    },
    {
      "name": "codebase",
      "params": {}
    },
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {}
    }
  ],
  "allowAnonymousTelemetry": false,
  "embeddingsProvider": {
    "provider": "transformers.js"
  }
};

export const defaultConfigJetBrains: SerializedContinueConfig = {
  "models": [
    {
      "title": "DeepSeek-Coder-Base @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Base-Ahrefs",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "commandModels": [
    {
      "title": "DeepSeek-Coder-Base @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Base-Ahrefs",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "tabAutocompleteModels": [
    {
      "title": "DeepSeek-Coder-Finetuned @Ahrefs",
      "provider": "openai",
      "model": "DeepSeek-Coder-Finetuned",
      "completionOptions": {},
      "apiBase": ""
    },
    {
      "title": "Ahrefs-Llama-3-8B",
      "provider": "openai",
      "model": "Llama-3-8B-Ahrefs",
      "apiBase": ""
    },
    {
      "title": "Ahrefs-DBRX-Base",
      "provider": "openai",
      "model": "DBRX-Base-Ahrefs",
      "apiBase": ""
    }
  ],
  "tabAutocompleteOptions": {
    "template": "<｜fim▁begin｜>{{{prefix}}}<｜fim▁hole｜>{{{suffix}}}<｜fim▁end｜>",
    "useSuffix": true,
    "useCache": true,
    "multilineCompletions": "auto",
    "debounceDelay": 50,
    "onlyMyCode": true,
    "useOtherFiles": true,
    "maxPromptTokens": 2048,
  },
  "disableIndexing": true,
  "slashCommands": [
    {
      "name": "edit",
      "description": "Edit selected code"
    },
    {
      "name": "comment",
      "description": "Write comments for the selected code"
    },
    {
      "name": "share",
      "description": "Download and share this session"
    },
    {
      "name": "cmd",
      "description": "Generate a shell command"
    }
  ],
  "customCommands": [
    {
      "name": "test",
      "prompt": "Write a comprehensive set of unit tests for the selected code. It should setup, run tests that check for correctness including important edge cases, and teardown. Ensure that the tests are complete and sophisticated. Give the tests just as chat output, don't edit any file.",
      "description": "Write unit tests for highlighted code"
    }
  ],
  "contextProviders": [
    {
      "name": "diff",
      "params": {}
    },
    {
      "name": "open",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    },
    {
      "name": "problems",
      "params": {}
    },
    {
      "name": "codebase",
      "params": {}
    },
    {
      "name": "code",
      "params": {}
    },
    {
      "name": "docs",
      "params": {}
    }
  ],
  "allowAnonymousTelemetry": false,
  "embeddingsProvider": {
    "provider": "transformers.js"
  }
};
