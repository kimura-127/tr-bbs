import { getAvatarThreads } from '@/app/actions/getThread';
import { ThreadHeader } from '@/components/ThreadHeader';
import { ThreadList } from '@/components/ThreadList';
import { avatarColumns } from '@/components/columns';
import { DataTableSkeleton } from '@/components/data-table-skeleton';
import { Suspense } from 'react';

export const metadata = {
  title: 'チョコットランド取引掲示板 | 装備売り買い・交換BBS',
  description:
    'チョコットランドの取引掲示板（BBS）です。アイテムや装備の売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。',
};

export const revalidate = 0;

export default function AvatarPage() {
  return (
    <main className="container mx-auto py-4">
      <ThreadHeader title="アバター掲示板" />
      <Suspense fallback={<DataTableSkeleton />}>
        <ThreadList columns={avatarColumns} getThreads={getAvatarThreads} />
      </Suspense>
    </main>
  );
}
