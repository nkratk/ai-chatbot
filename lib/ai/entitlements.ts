import type { UserType } from '@/app/(auth)/auth';
import type { ChatModel } from './models';

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel['id']>;
}

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ['chat-model-xai', 'chat-model-xai-reasoning', 'chat-model-openai'],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ['chat-model-xai', 'chat-model-xai-reasoning', 'chat-model-openai'],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
