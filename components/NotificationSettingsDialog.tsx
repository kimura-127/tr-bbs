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

  const [isSubscribing, setIsSubscribing] = useState(false);

  const encodeToBase64 = (arrayBuffer: ArrayBuffer | null) => {
    if (!arrayBuffer) return '';
    const uint8Array = new Uint8Array(arrayBuffer);
    return btoa(
      Array.from(uint8Array)
        .map((byte) => String.fromCharCode(byte))
        .join('')
    );
  };

  const handleSubscribePushNotification = async () => {
    try {
      setIsSubscribing(true);

      // ブラウザの対応確認
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.error('ブラウザが対応していません:', {
          serviceWorker: 'serviceWorker' in navigator,
          pushManager: 'PushManager' in window,
        });
        toast({
          title: 'エラー',
          description: 'お使いのブラウザはプッシュ通知に対応していません',
          variant: 'destructive',
        });
        return;
      }

      // 通知の許可を確認
      const permission = await Notification.requestPermission();
      console.log('通知許可の結果:', permission);
      if (permission !== 'granted') {
        toast({
          title: 'エラー',
          description: 'プッシュ通知の許可が必要です',
          variant: 'destructive',
        });
        return;
      }

      // Service Workerの登録を確認
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('既存のService Worker登録:', registrations);

      let registration: ServiceWorkerRegistration;
      if (registrations.length > 0) {
        registration = registrations[0];
      } else {
        // Service Workerが登録されていない場合は新規登録
        registration = await navigator.serviceWorker.register('/worker.js');
        console.log('Service Worker登録完了:', registration);
      }

      // Service Workerのアクティブ化を待機
      if (registration.waiting) {
        await new Promise((resolve) => {
          // メッセージハンドラーを設定
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'WORKER_READY') {
              resolve(true);
            }
          });

          // skipWaitingをリクエスト
          registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
        });

        // 新しいService Workerが確実にアクティブになるまで待機
        registration = await navigator.serviceWorker.ready;
      }

      // プッシュ通知の購読
      console.log('プッシュ通知の購読開始');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      console.log('サーバーへの購読情報送信開始');
      const response = await fetch('/api/push-notification/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          endpoint: subscription.endpoint,
          auth: encodeToBase64(subscription.getKey('auth')),
          p256dh: encodeToBase64(subscription.getKey('p256dh')),
        }),
      });

      const responseData = await response.json();
      console.log('サーバーレスポンス:', responseData);

      if (!response.ok) {
        throw new Error('プッシュ通知の設定に失敗しました');
      }

      toast({
        description: 'プッシュ通知を設定しました',
      });
    } catch (error) {
      console.error('プッシュ通知設定エラー:', error);
      toast({
        title: 'エラー',
        description: 'プッシュ通知の設定中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubscribing(false);
    }
  };

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
            <TabsTrigger value="push">プッシュ通知</TabsTrigger>
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
          <TabsContent value="push">
            <Card className="max-md:p-2">
              <CardHeader className="max-md:p-4">
                <CardTitle>プッシュ通知</CardTitle>
                <CardDescription>
                  新しいコメントがあった際にブラウザでプッシュ通知を受け取ります。
                  通知設定は1週間有効です。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-md:p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      ※ブラウザの通知設定を有効にする必要があります
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      ※iOSの場合は「ホーム画面に追加」してご利用ください
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="max-md:p-4">
                <Button
                  onClick={handleSubscribePushNotification}
                  disabled={isSubscribing}
                >
                  {isSubscribing
                    ? 'プッシュ通知を設定中...'
                    : 'プッシュ通知を有効にする'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
