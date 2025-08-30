'use client';

import { useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { generateUUID, fetchWithErrorHandlers } from '@/lib/utils';
import { unstable_serialize } from 'swr/infinite';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { ChatSDKError } from '@/lib/errors';
import { toast } from './toast';
import { Messages } from './messages';
import type { ChatMessage } from '@/lib/types';
import { useDataStream } from './data-stream-provider';
import { useSWRConfig } from 'swr';

type ChatPerModelProps = {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  isReadonly: boolean;
  autoResume: boolean;
  onInit?: (
    modelId: string,
    chatApi: ReturnType<typeof useChat>
  ) => void;
};

export function ChatPerModel({
  id,
  initialMessages,
  initialChatModel,
  isReadonly,
  autoResume,
  onInit,
}: ChatPerModelProps) {
  console.log('model', initialChatModel);
  const { mutate } = useSWRConfig();
  const { setDataStream } = useDataStream();

  const chat = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    generateId: generateUUID,
    experimental_throttle: 100,
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            message: messages.at(-1),
            selectedChatModel: initialChatModel,
            selectedVisibilityType: 'private',
            ...body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      console.log('dataPart', dataPart, 'setDataStream')
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast({ type: 'error', description: error.message });
      }
    },
  });

  // Expose per-model chat APIs to parent
  useEffect(() => {
    if (onInit) onInit(initialChatModel, chat);
  }, [onInit, initialChatModel]);

  return (
    <Messages
      chatId={id}
      status={chat.status}
      votes={undefined}
      messages={chat.messages}
      setMessages={chat.setMessages}
      regenerate={chat.regenerate}
      isReadonly={isReadonly}
      isArtifactVisible={false}
    />
  );
};

export { ChatPerModel };
