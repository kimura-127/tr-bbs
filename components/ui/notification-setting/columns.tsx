'use client';

import type { Article } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const notificationColumns: ColumnDef<Article>[] = [
  {
    accessorKey: 'title',
    header: 'トピックス',
    cell: ({ row }) => (
      <Link
        href={`/thread/${row.original.id}`}
        className="text-green-700 hover:underline"
      >
        {row.getValue('title')}
      </Link>
    ),
  },
  {
    accessorKey: 'replies_count',
    header: '返信数',
  },
  {
    accessorKey: 'updated_at',
    header: '更新日時',
    cell: ({ row }) => {
      const date = new Date(row.getValue('updated_at'));
      return date.toLocaleString('ja-JP');
    },
  },
];
