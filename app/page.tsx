import { getThreads } from '@/app/actions/getThread';
import { ThreadList } from '@/components/ThreadList';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'チョコットランド取引掲示板 | 装備売り買い・交換BBS',
  description:
    'チョコットランドの取引掲示板（BBS）です。アイテムや装備の売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。',
};

export const revalidate = 0; // キャッシュを無効化

export default async function Home() {
  const threads = await getThreads();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThreadList initialData={threads} />
    </Suspense>
  );
}
