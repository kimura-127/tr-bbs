import { getThreads } from '@/app/actions/getThread';
import { ThreadList } from '@/components/ThreadList';
import { DataTableSkeleton } from '@/components/data-table-skeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'チョコットランド取引掲示板 | 装備売り買い・交換BBS',
  description:
    'チョコットランドの取引掲示板（BBS）です。アイテムや装備の売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。',
};

export const revalidate = 3600; // 1時間ごとに再検証

export default async function Home() {
  return (
    <main className="container mx-auto py-4 space-y-4">
      {/* 静的な部分（SSG） */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">チョコットランド取引掲示板</h1>
        <p className="text-muted-foreground">
          チョコットランドのアイテム取引ができる掲示板です。
        </p>
      </div>

      {/* 動的な部分（SSR + Streaming） */}
      <Suspense fallback={<DataTableSkeleton />}>
        <ThreadList initialData={await getThreads()} />
      </Suspense>
    </main>
  );
}
