'use client';

import type { Thread } from '@/app/thread/[threadId]/actions';
import { createComment } from '@/app/thread/[threadId]/actions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'コメントを入力してください',
    })
    .max(1000, {
      message: 'コメントは1000文字以内で入力してください',
    }),
});

interface ThreadViewProps {
  thread: Thread;
}

export function ThreadView({ thread }: ThreadViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await createComment(thread.id, values);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: result.error,
        });
      } else {
        toast({
          description: 'コメントを投稿しました',
        });
        form.reset();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: 'エラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // NOTE: スレッドビュー
    <div className="container mx-auto py-1.5">
      <div>
        <div className="bg-gray-700 text-base px-4 h-12 flex items-center rounded-lg mb-2">
          <h1 className="text-xl font-semibold text-white tracking-wider leading-7">
            {thread.title}
          </h1>
        </div>
        <Breadcrumb className="mb-4 ml-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" prefetch={true}>
                  トップページ
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer">
                {thread.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="rounded-lg border p-4 shadow">
          <p className="text-gray-500">日時: {thread.createdAt}</p>
          <p className="text-gray-500 mb-4">投稿者: 名無し</p>
          <div className="whitespace-pre-wrap leading-6 tracing-wide">
            {thread.content}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="border-t w-full my-14" />
        <div className="flex-1">
          <p className="whitespace-nowrap px-4">コメント</p>
        </div>
        <div className="border-t w-full my-14" />
      </div>

      {/* NOTE: コメント一覧 */}
      {thread.replies.length > 0 && (
        <div className="mb-10">
          <div className="space-y-4">
            {thread.replies.map((reply) => (
              <div key={reply.id} className="rounded-lg border p-4 shadow">
                <p className="text-gray-500">日時: {reply.createdAt}</p>
                <p className="text-gray-500 mb-2">投稿者: 名無し</p>
                <div className="whitespace-pre-wrap leading-6 tracking-wide">
                  {reply.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTE: コメント投稿フォーム */}
      <div className="border rounded-lg p-4 shadow tracking-wide leading-7 mb-40">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="コメントを入力"
                      className="mb-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-80 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide"
              >
                {isLoading ? '送信中...' : 'このスレッドに返信'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
