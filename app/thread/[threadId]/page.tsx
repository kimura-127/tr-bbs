import { ThreadView } from '@/components/ThreadView';
import { notFound } from 'next/navigation';
import { getThread } from './actions';

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

  return <ThreadView thread={thread} />;
}
