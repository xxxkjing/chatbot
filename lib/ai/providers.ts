import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

const provider = createOpenAICompatible({
  name: 'gemini',
  baseURL: 'https://doi9.top/v1',
  apiKey : process.env.OPENAI_BASE_API_KEY,
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': provider(process.env.OPENAI_DEFAULT_MODEL),
        'chat-model-reasoning': wrapLanguageModel({
          model: provider(process.env.OPENAI_REASONING_MODEL),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': provider(process.env.OPENAI_TITLE_MODEL),
        'artifact-model': provider(process.env.OPENAI_ARTIFACT_MODEL),
      },
      imageModels: {
        'small-model': provider.imageModel('grok-2-image'),
      },
    });
