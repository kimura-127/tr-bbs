'use client';
import { useReadThreads } from '@/hooks/useReadThreads';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Button } from './ui/button';

export type Payment = {
  id: string;
  title: string;
  name: string;
  replyCount: number;
  createdAt: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'title',
    header: 'トピックス',
    cell: ({ row }) => {
      const ReadThreads = useReadThreads();
      const isRead = ReadThreads.isRead(row.original.id);

      return (
        <Link
          onClick={() => ReadThreads.markAsRead(row.original.id)}
          href={`/thread/${row.original.id}`}
          prefetch={true}
          className={`text-green-700 hover:underline ${isRead && 'text-red-500'}`}
        >
          {row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'name',
    header: '投稿者',
  },
  {
    accessorKey: 'replyCount',
    header: '返信',
  },
  {
    accessorKey: 'createdAt',
    header: '投稿日時',
  },
];
