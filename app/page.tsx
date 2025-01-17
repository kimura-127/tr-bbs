import { getThreads } from '@/app/actions/getThread';
import { ThreadList } from '@/components/ThreadList';
import { Suspense } from 'react';

export const revalidate = 0; // キャッシュを無効化

export default async function Home() {
  const threads = await getThreads();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadList initialData={threads} />
    </Suspense>
  );
}
