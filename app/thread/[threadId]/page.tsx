import { ThreadView } from '@/components/ThreadView';
import { notFound } from 'next/navigation';
import { getThread } from './actions';

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const thread = await getThread(params.threadId);

  if (!thread) {
    notFound();
  }

  return <ThreadView thread={thread} />;
}
