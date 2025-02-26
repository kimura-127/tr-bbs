'use client';

import {
  createAvatarThread,
  createFreeTalkThread,
  createTradingThread,
} from '@/app/actions/createThread';
import { ImageUpload } from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CreateResult, ThreadType } from '@/types';
import { getClientId, setClientId } from '@/utils/generateUserIdentifier';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { AnimateTextarea } from './ui/animate-text-area';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'タイトルは2文字以上で入力してください' })
    .max(50, { message: 'タイトルは50文字以内で入力してください' }),
  name: z
    .string()
    .min(1, { message: '名前は1文字以上で入力してください' })
    .max(15, { message: '名前は15文字以内で入力してください' }),
  content: z
    .string()
    .min(10, { message: 'コメントは10文字以上で入力してください' })
    .max(1000, { message: 'コメントは1000文字以内で入力してください' }),
  password: z
    .union([z.string(), z.null()])
    .refine(
      (val) =>
        val === null || val === '' || (val.length === 4 && /^\d+$/.test(val)),
      { message: 'パスワードは4桁の数字で入力してください' }
    )
    .transform((val) => {
      if (val === null || val === '') return null;
      return Number.parseInt(val, 10);
    })
    .nullable()
    .optional(),
  boardType: z.enum(['trade', 'free-talk', 'avatar'], {
    required_error: '掲示板を選択してください',
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

export function CreateThreadForm({
  threadType,
  setIsDialogOpen,
}: {
  threadType: ThreadType;
  setIsDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // キーボードイベントハンドラを追加
  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey && !isLoading) {
      e.preventDefault();
      const isValid = await form.trigger();
      if (isValid) {
        const formData = form.getValues();
        await onSubmit(formData);
      }
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      name:
        typeof window !== 'undefined'
          ? localStorage.getItem('userName') || '名無し'
          : '名無し',
      content: '',
      password: null,
      boardType: threadType,
      images: [],
    },
  });

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

          // 公開URLを取得
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
    try {
      // 名前をローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('userName', values.name);
      }

      // 画像がある場合はアップロード
      let image_urls: string[] = [];
      if (values.images && values.images.length > 0) {
        const uploadResult = await uploadImages(values.images);
        if (uploadResult.error) {
          toast.info('画像のアップロードに失敗しました');
          return;
        }
        image_urls = uploadResult.imageUrls || [];
      }

      // デバイス情報を取得
      let clientId = getClientId();
      if (!clientId) {
        // IPアドレスの取得はバックエンドで行う
        const response = await fetch('/api/get-client-id');
        const data = await response.json();
        clientId = data.clientId;
        if (clientId) {
          setClientId(clientId);
        }
      }

      if (!clientId) {
        toast.info('クライアントIDの取得に失敗しました', {
          description: 'IPアドレスからクライアントIDを取得できませんでした',
        });
        return;
      }

      // スレッドデータを準備
      const threadData = {
        title: values.title,
        name: values.name,
        content: values.content,
        password: values.password,
        image_urls: image_urls,
        client_id: clientId,
      };

      // 選択された掲示板の種類に応じてスレッドを作成
      let result: CreateResult;
      switch (values.boardType) {
        case 'trade':
          router.prefetch('/');
          result = await createTradingThread(threadData);
          break;
        case 'free-talk':
          router.prefetch('/free-talk');
          result = await createFreeTalkThread(threadData);
          break;
        case 'avatar':
          router.prefetch('/avatar');
          result = await createAvatarThread(threadData);
          break;
      }

      if (result?.error) {
        toast.info(`このアカウントはブロックされています: ${result.error}`);
      } else if (result?.success) {
        result.warning
          ? toast.warning(`警告があります: ${result.warning}`)
          : toast.success('スレッドを作成しました');

        form.reset();
        // 掲示板の種類に応じてリダイレクト先を変更
        switch (values.boardType) {
          case 'trade':
            router.push('/');
            break;
          case 'free-talk':
            router.push('/free-talk');
            break;
          case 'avatar':
            router.push('/avatar');
            break;
        }
      }
    } catch (error) {
      toast.info('エラーが発生しました');
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold tracking-wide text-foreground/90">
                タイトル
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="タイトルを入力"
                  className="my-4 leading-8 tracking-wider max-md:leading-6 max-md:text-sm bg-background text-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold tracking-wide text-foreground/90">
                名前
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="お名前を入力"
                  className="my-4 leading-8 tracking-wider max-md:leading-6 max-md:text-sm bg-background text-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold tracking-wider text-foreground/90">
                パスワード
                <span className="text-sm text-muted-foreground">
                  （任意・4桁の数字）
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="スレッド上位表示機能のためのパスワード"
                  className="my-4 leading-8 tracking-wider max-md:leading-6 max-md:text-sm bg-background text-foreground"
                  value={field.value === null ? '' : field.value}
                  onChange={(e) => {
                    // 入力値が空の場合はnullを設定
                    if (e.target.value === '') {
                      field.onChange(null);
                      return;
                    }

                    // 数字のみを許可し、4桁までに制限
                    const value = e.target.value
                      .replace(/[^0-9]/g, '')
                      .slice(0, 4);
                    field.onChange(value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold tracking-wider text-foreground/90">
                スレッドの内容
              </FormLabel>
              <FormControl>
                <AnimateTextarea
                  placeholder="スレッドの内容を入力"
                  className="my-4 min-h-[14rem] 2xl:min-h-[24rem] bg-background text-foreground"
                  onKeyDown={handleKeyDown}
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
              <FormLabel className="font-semibold tracking-wider text-foreground/90">
                画像
              </FormLabel>
              <FormControl>
                <ImageUpload
                  disabled={isLoading}
                  onChange={field.onChange}
                  value={[]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="boardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold tracking-wider text-foreground/90">
                掲示板の種類
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={threadType}
                  className="flex flex-col max-md:gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="trade" className="text-primary" />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 border-border w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-muted/80 dark:hover:bg-secondary/30 transition-colors duration-200">
                      取引掲示板
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem
                        value="free-talk"
                        className="text-primary"
                      />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 border-border w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-muted/80 dark:hover:bg-secondary/30 transition-colors duration-200">
                      雑談掲示板
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem value="avatar" className="text-primary" />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 border-border w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-muted/80 dark:hover:bg-secondary/30 transition-colors duration-200">
                      アバター掲示板
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center pt-10">
          <Button
            type="submit"
            className="h-16 w-80 bg-gray-700 hover:bg-gray-800 dark:text-white font-semibold gap-2 text-base tracking-wide text-primary-foreground transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? '作成中...' : 'スレッド作成'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          スレッド詳細ページで通知設定が可能です。
          <br />
          コメントが投稿された際に通知を受け取ることができます。
        </p>
      </form>
    </Form>
  );
}
