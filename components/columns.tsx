'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useReadThreads } from '@/hooks/useReadThreads';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export type Payment = {
  id: string;
  title: string;
  content: string;
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
        <div className="w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value={row.original.id} className="border-none">
              <AccordionTrigger className="hover:no-underline h-fit flex gap-4 px-4">
                <Link
                  onClick={() => ReadThreads.markAsRead(row.original.id)}
                  href={`/thread/${row.original.id}`}
                  prefetch={true}
                  className={`text-green-700 hover:underline ${isRead && 'text-red-500'}`}
                >
                  {row.original.title}
                </Link>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground p-4 whitespace-pre-wrap border-t mt-4">
                {row.original.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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

export const avatarColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'title',
    header: 'トピックス',
    cell: ({ row }) => {
      const ReadThreads = useReadThreads();
      const isRead = ReadThreads.isRead(row.original.id);

      return (
        <div className="w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value={row.original.id} className="border-none">
              <AccordionTrigger className="hover:no-underline h-fit flex gap-4 px-4">
                <Link
                  onClick={() => ReadThreads.markAsRead(row.original.id)}
                  href={`/avatar/thread/${row.original.id}`}
                  prefetch={true}
                  className={`text-green-700 hover:underline ${isRead && 'text-red-500'}`}
                >
                  {row.original.title}
                </Link>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground p-4 whitespace-pre-wrap border-t mt-4">
                {row.original.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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

export const freeTalkColumns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'title',
    header: 'トピックス',
    cell: ({ row }) => {
      const ReadThreads = useReadThreads();
      const isRead = ReadThreads.isRead(row.original.id);

      return (
        <div className="w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value={row.original.id} className="border-none">
              <AccordionTrigger className="hover:no-underline h-fit flex gap-4 px-4">
                <Link
                  onClick={() => ReadThreads.markAsRead(row.original.id)}
                  href={`/free-talk/thread/${row.original.id}`}
                  prefetch={true}
                  className={`text-green-700 hover:underline ${isRead && 'text-red-500'}`}
                >
                  {row.original.title}
                </Link>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground p-4 whitespace-pre-wrap border-t mt-4">
                {row.original.content}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
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
