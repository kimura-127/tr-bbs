import { ThreadView } from '@/components/ThreadView';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getThread } from './actions';

export const revalidate = 0; // キャッシュを無効化

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const thread = await getThread(threadId);

  if (!thread) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadView thread={thread} threadType="trade" />
    </Suspense>
  );
}
