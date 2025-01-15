'use client';
import type { ColumnDef } from '@tanstack/react-table';

export type Payment = {
  title: string;
  name: string;
  replyCount: number;
  createdAt: Date;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'title',
    header: 'トピックス',
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
