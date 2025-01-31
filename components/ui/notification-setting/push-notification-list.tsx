'use client';

import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { PushSubscriptionWithArticle } from '@/types';
import type { Database } from '@/types/supabase';
import { createClient } from '@/utils/supabase/client';
import { useCallback, useEffect, useState } from 'react';

type DbArticle = Database['public']['Tables']['articles']['Row'];
type DbPushSubscription =
  Database['public']['Tables']['push_subscriptions']['Row'];

type PushSubscriptionJoin = DbPushSubscription & {
  articles: DbArticle;
};

export function PushNotificationList() {
  const [pushSubscriptions, setPushSubscriptions] = useState<
    PushSubscriptionWithArticle[]
  >([]);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);
  const { toast } = useToast();

  // 現在のデバイスのendpointを取得
  const getCurrentSubscription = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        setCurrentEndpoint(subscription.endpoint);
      }
    } catch (error) {
      console.error('現在の購読情報の取得に失敗:', error);
    }
  }, []);

  // プッシュ通知の購読情報を取得
  const fetchPushSubscriptions = useCallback(async () => {
    if (!currentEndpoint) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*, articles(*)')
      .eq('endpoint', currentEndpoint)
      .gt('expires_at', new Date().toISOString())
      .returns<PushSubscriptionJoin[]>();

    if (error) {
      console.error('購読情報の取得に失敗:', error);
      return;
    }

    if (!data) return;

    const formattedData: PushSubscriptionWithArticle[] = data.map(
      (subscription) => ({
        id: subscription.id,
        endpoint: subscription.endpoint,
        thread_id: subscription.thread_id,
        expires_at: subscription.expires_at,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
        auth: subscription.auth,
        p256dh: subscription.p256dh,
        articles: {
          id: subscription.articles.id,
          title: subscription.articles.title,
          content: subscription.articles.content,
          name: '名無し',
          replyCount: subscription.articles.replies_count,
          createdAt: new Date(subscription.articles.created_at).toLocaleString(
            'ja-JP',
            {
              timeZone: 'Asia/Tokyo',
              hour12: false,
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }
          ),
          created_at: subscription.articles.created_at,
          updated_at: subscription.articles.updated_at,
          user_id: subscription.articles.user_id,
          image_urls: subscription.articles.image_urls,
          replies_count: subscription.articles.replies_count,
        },
      })
    );

    setPushSubscriptions(formattedData);
  }, [currentEndpoint]);

  // プッシュ通知の購読を解除
  const handleUnsubscribe = async (subscriptionId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) throw error;

      // 購読リストを更新
      await fetchPushSubscriptions();

      toast({
        description: '通知設定を解除しました',
      });
    } catch (error) {
      console.error('購読解除に失敗:', error);
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '通知設定の解除に失敗しました',
      });
    }
  };

  // コンポーネントマウント時に現在のendpointを取得
  useEffect(() => {
    getCurrentSubscription();
  }, [getCurrentSubscription]);

  // endpointが取得できたら購読情報を取得
  useEffect(() => {
    if (currentEndpoint) {
      fetchPushSubscriptions();
    }
  }, [currentEndpoint, fetchPushSubscriptions]);

  const articles = pushSubscriptions.map((sub) => sub.articles);

  return (
    <div>
      <div className="my-4 space-y-2">
        <p className="text-sm">
          プッシュ通知の設定は各スレッドの詳細画面から行えます。
          設定済みの通知は下の一覧から確認・解除できます。
        </p>
      </div>
      <DataTable
        threadType="trade"
        columns={[
          ...columns,
          {
            id: 'actions',
            header: '操作',
            cell: ({ row }) => {
              const subscription = pushSubscriptions.find(
                (sub) => sub.articles.id === row.original.id
              );

              return (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (subscription) {
                      handleUnsubscribe(subscription.id);
                    }
                  }}
                >
                  削除
                </Button>
              );
            },
          },
        ]}
        data={articles}
        isVisibleCreateWithSearch={false}
      />
    </div>
  );
}
