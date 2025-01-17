import { ThreadList } from '@/components/ThreadList';
import { getThreads } from './actions/getThread';

// パフォーマンス計測用
export default async function Home() {
  const data = await getThreads();

  return <ThreadList initialData={data} />;
}
