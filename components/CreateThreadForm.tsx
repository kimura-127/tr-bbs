'use client';

import { createThread } from '@/app/actions/createThread';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(10).max(1000),
});

export function CreateThreadForm({
  setIsDialogOpen,
}: { setIsDialogOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await createThread(values);
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
                <Textarea className="h-80 2xl:h-96" {...field} />
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
