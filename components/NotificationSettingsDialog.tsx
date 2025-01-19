'use client';

import { subscribeToEmailNotifications } from '@/app/actions/sendNotificationEmail';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface NotificationSettingsDialogProps {
  threadId: string;
}

const emailFormSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export function NotificationSettingsDialog({
  threadId,
}: NotificationSettingsDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true);
    try {
      console.log('送信開始');
      const result = await subscribeToEmailNotifications({
        threadId,
        email: values.email,
      });
      console.log('送信終了');
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: result.error,
        });
      } else {
        toast({
          description: 'メール通知を設定しました',
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-52 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-xs tracking-wide">
          <Bell /> コメント通知をオンにする
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-md:p-4 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>通知設定</DialogTitle>
          <DialogDescription>
            このスレッドの通知設定を行います
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-md:text-xs max-md:gap-1">
            <TabsTrigger value="email">メール</TabsTrigger>
            <TabsTrigger value="line" className="max-md:text-[10px]">
              LINE※近日実装予定
            </TabsTrigger>
          </TabsList>
          <TabsContent value="email">
            <Card className="max-md:p-2">
              <CardHeader className="max-md:p-4">
                <CardTitle>メール通知</CardTitle>
                <CardDescription>
                  新しいコメントがあった際にメールで通知を受け取ります
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-2 max-md:p-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="email">メールアドレス</Label>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="example@example.com"
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="max-md:p-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? '設定中...' : '設定を保存'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          <TabsContent value="line">
            <Card className="max-md:p-2">
              <CardHeader className="max-md:p-4">
                <CardTitle>LINE通知</CardTitle>
                <CardDescription>
                  新しいコメントがあった際にLINEで通知を受け取ります
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-md:p-4">
                <div className="space-y-1">
                  <Label htmlFor="line-token">LINEトークン</Label>
                  <Input
                    id="line-token"
                    type="password"
                    placeholder="LINE Notify トークン"
                  />
                </div>
              </CardContent>
              <CardFooter className="max-md:p-4">
                <Button>設定を保存</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
