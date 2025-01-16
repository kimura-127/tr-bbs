'use client';
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
      return (
        <Link href={`/thread/${row.original.id}`}>
          <Button variant="link" className="text-green-700">
            {row.original.title}
          </Button>
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
