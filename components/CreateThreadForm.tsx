'use client';

import { createThread } from '@/app/actions/createThread';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'タイトルは2文字以上で入力してください' })
    .max(50, { message: 'タイトルは50文字以内で入力してください' }),
  content: z
    .string()
    .min(10, { message: 'コメントは10文字以上で入力してください' })
    .max(1000, { message: 'コメントは1000文字以内で入力してください' }),
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
  setIsDialogOpen,
}: {
  setIsDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
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

      // スレッドを作成
      const result = await createThread({
        title: values.title,
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
          description: 'スレッドを作成しました',
        });
        form.reset();
        router.refresh();
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
                <Input {...field} />
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
                コメント
              </FormLabel>
              <FormControl>
                <Textarea className="h-40 2xl:h-96" {...field} />
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
        <div className="flex justify-center">
          <Button
            type="submit"
            className="h-12 w-80 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide"
            disabled={isLoading}
          >
            {isLoading ? '作成中...' : 'スレッド作成'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
