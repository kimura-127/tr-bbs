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

async function getData(): Promise<Payment[]> {
  return [
    {
      title: 'とぴっく',
      name: '名無し',
      replyCount: 3,
      createdAt: new Date(),
    },
  ];
}

export default async function Home() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <div className="flex gap-1 bg-gray-700 rounded-lg px-2 py-1.5 mb-6">
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-8 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide">
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
              <CreateThreadForm />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button className="h-8 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide">
            <Search />
            検索
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
