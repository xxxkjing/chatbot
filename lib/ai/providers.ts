import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { createXai } from '@ai-sdk/xai';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

const xai = createXai({
  baseURL: process.env.OPENAI_BASE_URL,
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
        'chat-model': xai(process.env.OPENAI_DEFAULT_MODEL),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai(process.env.OPENAI_REASONING_MODEL),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai(process.env.OPENAI_TITLE_MODEL),
        'artifact-model': xai(process.env.OPENAI_ARTIFACT_MODEL),
      },
      imageModels: {
        'small-model': xai.imageModel('grok-2-image'),
      },
    });
