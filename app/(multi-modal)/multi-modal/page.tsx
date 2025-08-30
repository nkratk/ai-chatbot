import { cookies } from 'next/headers';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { generateUUID } from '@/lib/utils';
import { auth } from '../../(auth)/auth';
import { redirect } from 'next/navigation';
import { MultiModelChat } from '@/components/multi-model-chat';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdsFromCookie = cookieStore.get('chat-models')?.value;

  const initialSelectedModels = modelIdsFromCookie
    ? modelIdsFromCookie.split(',')
    : [];

  return (
    <>
      <MultiModelChat
        id={id}
        session={session}
        initialMessages={[]}
        initialSelectedModels={initialSelectedModels}
        isReadonly={false}
        initialVisibilityType="private"
        autoResume={false}
      />
      <DataStreamHandler />
    </>
  );
}
