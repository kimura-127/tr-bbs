'use client';

import { CreateThreadForm } from '@/components/CreateThreadForm';
import { type Payment, columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Bell, Brain, Search, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  initialData: Payment[];
};

export function ThreadList({ initialData }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisibleSearch, setIsVisibleSearch] = useState(false);

  return (
    <div className="container mx-auto py-1.5">
      <div className="flex gap-1 bg-gray-700 rounded-lg px-2 h-12 items-center">
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
                <SquarePen />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen overflow-auto">
              <DialogHeader>
                <DialogTitle>新規スレッド作成</DialogTitle>
                <DialogDescription className="py-2">
                  タイトルとコメントを入力してください
                </DialogDescription>
              </DialogHeader>
              <CreateThreadForm setIsDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button
            onClick={() => setIsVisibleSearch(!isVisibleSearch)}
            className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
          >
            <Search />
            検索
          </Button>
        </div>
        <div>
          <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
            <Link
              className="flex justify-center items-center gap-2"
              href={'/notificationSetting'}
            >
              <Bell />
              通知設定
            </Link>
          </Button>
        </div>
        <div>
          <Button
            onClick={() =>
              toast.info('AIによる相場検索機能', {
                description: '近日実装予定です。今しばらくお待ちください。',
                action: {
                  label: '閉じる',
                  onClick: () => {},
                },
              })
            }
            className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
          >
            <Brain />
            AIによる相場検索
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={initialData}
        isVisibleSearch={isVisibleSearch}
      />
    </div>
  );
}
