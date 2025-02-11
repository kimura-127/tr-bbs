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
import { useToast } from '@/hooks/use-toast';
import type { ThreadType } from '@/types';
import { getWebGLFingerprint } from '@/utils/getWebGLFingerprint';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

// 戻り値の型を定義
interface ThreadResult {
  error?: string;
  success?: boolean;
}

export function CreateThreadForm({
  threadType,
  setIsDialogOpen,
}: {
  threadType: ThreadType;
  setIsDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      name:
        typeof window !== 'undefined'
          ? localStorage.getItem('userName') || '名無し'
          : '名無し',
      content: '',
      boardType: threadType,
      images: [],
    },
  });
  const { toast } = useToast();

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
          toast({
            variant: 'destructive',
            title: 'エラー',
            description: uploadResult.error,
          });
          return;
        }
        image_urls = uploadResult.imageUrls || [];
      }

      // デバイス情報を取得
      const webglInfo = await getWebGLFingerprint();
      const deviceFingerprint = {
        renderHash: webglInfo?.renderHash || null,
        precision: {
          rangeMin: webglInfo?.precision?.rangeMin || null,
          rangeMax: webglInfo?.precision?.rangeMax || null,
          precision: webglInfo?.precision?.precision || null,
        },
      };

      // スレッドデータを準備
      const threadData = {
        title: values.title,
        name: values.name,
        content: values.content,
        image_urls: image_urls,
        device_info: deviceFingerprint,
      };

      // 選択された掲示板の種類に応じてスレッドを作成
      let result: ThreadResult;
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
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: result.error,
        });
      } else {
        toast({
          description: 'スレッドを作成しました',
        });
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
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: 'エラーが発生しました',
      });
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
              <FormLabel className="font-semibold tracking-wide">
                タイトル
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="タイトルを入力"
                  className="my-4 leading-8 tracking-wider max-md:leading-6 max-md:text-sm"
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
              <FormLabel className="font-semibold tracking-wide">
                名前
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="お名前を入力"
                  className="my-4 leading-8 tracking-wider max-md:leading-6 max-md:text-sm"
                  {...field}
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
              <FormLabel className="font-semibold tracking-wider">
                スレッドの内容
              </FormLabel>
              <FormControl>
                <AnimateTextarea
                  placeholder="スレッドの内容を入力"
                  className="my-4 h-56 2xl:h-96"
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
              <FormLabel className="font-semibold tracking-wider">
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
                      <RadioGroupItem value="trade" className="text-blue-700" />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-gray-50">
                      取引掲示板
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem
                        value="free-talk"
                        className="text-blue-700"
                      />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-gray-50">
                      雑談掲示板
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 relative">
                    <FormControl>
                      <RadioGroupItem
                        value="avatar"
                        className="text-blue-700"
                      />
                    </FormControl>
                    <FormLabel className="tracking-lg leading-6 border-2 w-60 flex justify-center py-2 rounded-md cursor-pointer hover:bg-gray-50">
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
            className="h-16 w-80 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? '作成中...' : 'スレッド作成'}
          </Button>
        </div>
        <p className="text-sm text-gray-500 text-center">
          スレッド詳細ページで通知設定が可能です。
          <br />
          コメントが投稿された際に通知を受け取ることができます。
        </p>
      </form>
    </Form>
  );
}
