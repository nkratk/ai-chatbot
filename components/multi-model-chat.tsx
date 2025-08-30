'use client';

import { useState, useRef } from 'react';
import type { Session } from 'next-auth';
import { MultiModelSelector } from './multi-model-selector';
import { chatModels } from '@/lib/ai/models';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { MultimodalInput } from './multimodal-input';
import { ChatPerModel } from './chat-per-modal';
import type { ChatMessage, Attachment } from '@/lib/types';
import type { VisibilityType } from './visibility-selector';
import { saveChatModelsAsCookie } from '@/app/(multi-modal)/actions';

export function MultiModelChat({
  session,
  initialSelectedModels,
  id,
  isReadonly = false,
  initialMessages = [],
  initialVisibilityType = 'private',
  autoResume = false,
}: {
  session: Session;
  initialSelectedModels: string[];
  id: string;
  isReadonly: boolean;
  initialMessages: ChatMessage[];
  initialVisibilityType: VisibilityType;
  autoResume: boolean;
}) {
  const [selectedModelIds, setSelectedModelIds] = useState(initialSelectedModels);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const chatApisRef = useRef<Record<string, any>>({});

  const handleSelectionChange = (newIds: string[]) => {
    setSelectedModelIds(newIds);
    saveChatModelsAsCookie(newIds);
  };

  const handleModelInit = (modelId: string, chatApi: any) => {
    console.log('handleModelInit', modelId, chatApi);
    if (!chatApisRef.current[modelId]) {
      chatApisRef.current[modelId] = chatApi;
    }
  };

  const activeModelId = selectedModelIds[0];
  const activeChat = chatApisRef.current[activeModelId];

  const userType = session.user.type;
  const { availableChatModelIds } = entitlementsByUserType[userType];
  const availableChatModels = chatModels.filter((model) =>
    availableChatModelIds.includes(model.id)
  );

  return (
    <div className="flex flex-col h-dvh">
      <div className="p-4 border-b">
        <MultiModelSelector
          selectedModelIds={selectedModelIds}
          onSelectionChange={handleSelectionChange}
          availableChatModels={availableChatModels}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {selectedModelIds.map((model) => (
          <ChatPerModel
            key={model}
            id={id}
            initialMessages={initialMessages}
            initialChatModel={model}
            isReadonly={isReadonly}
            autoResume={autoResume}
            onInit={handleModelInit}
          />
        ))}
      </div>

      <div className="sticky bottom-0 flex gap-2 px-4 pb-4 mx-auto w-full bg-background md:pb-6 md:max-w-3xl z-[1] border-t-0">
        { console.log('activeChat', activeChat) }
        {!isReadonly && activeChat && selectedModelIds.length > 0 && (
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            status={activeChat?.status}
            stop={activeChat?.stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={activeChat?.messages}
            setMessages={activeChat?.setMessages}
            sendMessage={activeChat?.sendMessage}
            selectedVisibilityType="private"
          />
        )}
      </div>
    </div>
  );
}

export default MultiModelChat;
