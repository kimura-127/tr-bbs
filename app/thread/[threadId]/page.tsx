import { ThreadView } from '@/components/ThreadView';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getThread } from './actions';

export const revalidate = 0; // キャッシュを無効化

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const thread = await getThread(params.threadId);

  if (!thread) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadView thread={thread} />
    </Suspense>
  );
}
