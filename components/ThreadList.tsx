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
import { Search, SquarePen } from 'lucide-react';
import { useState } from 'react';

type Props = {
  initialData: Payment[];
};

export function ThreadList({ initialData }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-1.5">
      <div className="flex gap-1 bg-gray-700 rounded-lg px-2 py-1.5 mb-6">
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-8 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
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
          <Button className="h-8 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
            <Search />
            検索
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={initialData} />
    </div>
  );
}
