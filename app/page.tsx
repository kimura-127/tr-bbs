import { ThreadList } from '@/components/ThreadList';
import { getThreads } from './actions/getThread';

export default async function Home() {
  const data = await getThreads();

  return <ThreadList initialData={data} />;
}
