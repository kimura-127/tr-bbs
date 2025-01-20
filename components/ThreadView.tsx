'use client';

import type { Thread } from '@/app/thread/[threadId]/actions';
import { bumpThread, createComment } from '@/app/thread/[threadId]/actions';
import { NotificationSettingsDialog } from '@/components/NotificationSettingsDialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileCheck2, RotateCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { ImageUpload } from './image-upload';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const formSchema = z.object({
  content: z
    .string()
    .min(1, {
      message: 'コメントを入力してください',
    })
    .max(1000, {
      message: 'コメントは1000文字以内で入力してください',
    }),
  images: z
    .array(
      z
        .any()
        .refine((file) => file instanceof File, 'ファイル形式が不正です')
        .refine(
          (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
          '画像サイズは5MB以内にしてください'
        )
        .refine(
          (file) =>
            file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
          'JPGまたはPNG形式の画像のみアップロード可能です'
        )
    )
    .max(4, { message: '画像は最大4枚までアップロードできます' })
    .optional()
    .default([]),
});

interface ThreadViewProps {
  thread: Thread;
}

export function ThreadView({ thread }: ThreadViewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [bumpSuccess, setBumpSuccess] = useState(false);
  const [resetImages, setResetImages] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      images: [],
    },
  });

  // 画像アップロード処理
  async function uploadImages(files: File[]) {
    const supabase = createClient();
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('thread_images')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from('thread_images').getPublicUrl(fileName);

          return publicUrl;
        })
      );

      return { imageUrls };
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      return { error: '画像のアップロードに失敗しました' };
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResetImages(false);
    try {
      // 画像がある場合はアップロード
      let imageUrls: string[] = [];
      if (values.images && values.images.length > 0) {
        const uploadResult = await uploadImages(values.images);
        if (uploadResult.error) {
          toast({
            variant: 'destructive',
            title: 'エラー',
            description: uploadResult.error,
          });
          return;
        }
        imageUrls = uploadResult.imageUrls || [];
      }

      const result = await createComment(thread.id, {
        content: values.content,
        imageUrls,
      });

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
        setResetImages(true);
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

  // 画像表示用の共通コンポーネント
  const ImageGallery = ({ urls }: { urls: string[] | null }) => {
    if (!urls || urls.length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {urls.map((url, index) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square group cursor-zoom-in"
          >
            <Image
              src={url}
              alt={`投稿画像 ${index + 1}`}
              fill
              className="object-cover rounded-lg transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
          </a>
        ))}
      </div>
    );
  };

  return (
    // NOTE: スレッドビュー
    <div className="container mx-auto py-1.5">
      <div className="mb-4">
        <div className="bg-gray-700 text-base px-4 h-12 flex items-center rounded-lg mb-2">
          <h1
            className={`max-md:text-sm ${
              thread.title.length > 30 ? 'text-sm' : 'text-xl'
            } font-semibold text-white tracking-wider leading-7`}
          >
            {thread.title}
          </h1>
        </div>
        <Breadcrumb className="mb-4 ml-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/'} prefetch={true}>
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
          <ImageGallery urls={thread.image_urls} />
        </div>
      </div>

      <div className="flex justify-end gap-2 max-md:flex-col max-md:items-end">
        <Button
          onClick={async () => {
            setIsBumping(true);
            setBumpSuccess(false);
            try {
              const result = await bumpThread(thread.id);
              if (result.error) {
                toast({
                  variant: 'destructive',
                  title: 'エラー',
                  description: result.error,
                });
              } else {
                setBumpSuccess(true);
                setTimeout(() => {
                  setBumpSuccess(false);
                }, 1000);
                toast({
                  description: 'スレッドを上位に表示しました',
                });
              }
            } catch (error) {
              toast({
                variant: 'destructive',
                title: 'エラー',
                description: 'エラーが発生しました',
              });
            } finally {
              setIsBumping(false);
            }
          }}
          disabled={isBumping}
          className="w-52 max-md:text-xs max-md:tracking-normal bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-xs tracking-wide"
        >
          {bumpSuccess ? (
            <div className="flex items-center gap-2">
              <FileCheck2 />
              <p>上位に表示されました！</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RotateCw className={isBumping ? 'animate-spin' : ''} />
              <p>スレッドを上位に表示させる</p>
            </div>
          )}
        </Button>
        <NotificationSettingsDialog threadId={thread.id} />
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
                <ImageGallery urls={reply.image_urls} />
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
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold tracking-wider">
                    画像
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={isLoading}
                      onChange={field.onChange}
                      value={[]}
                      reset={resetImages}
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
