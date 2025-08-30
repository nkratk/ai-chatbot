export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-xai',
    name: 'Xai grok2 Chat model',
    description: 'Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-xai-reasoning',
    name: 'Xai grok3 Reasoning model',
    description: 'Uses advanced reasoning',
  },
  {
    id: 'chat-model-openai',
    name: 'OpenAI o3 mini Chat model',
    description: 'Premium model for all-purpose chat',
  },
];
