'use server';

import { cookies } from 'next/headers';

/**
 * Saves multiple chat model IDs to a cookie.
 * The array of IDs is stored as a comma-separated string.
 */
export async function saveChatModelsAsCookie(models: string[]) {
  const cookieStore = await cookies();
  cookieStore.set('chat-models', models.join(','));
}
