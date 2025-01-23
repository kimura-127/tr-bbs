import { ThreadView } from '@/components/ThreadView';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getFreeTalkThread } from './action';

export const revalidate = 0; // キャッシュを無効化

export default async function FreeTalkThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getFreeTalkThread(threadId);

  if (!thread) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadView thread={thread} type="free-talk" />
    </Suspense>
  );
}
