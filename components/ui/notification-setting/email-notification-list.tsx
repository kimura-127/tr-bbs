'use client';

import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { NotificationSettingWithArticle } from '@/types';
import { useEffect, useState } from 'react';

interface EmailNotificationListProps {
  getNotificationSettings: (
    email: string
  ) => Promise<NotificationSettingWithArticle[]>;
  deleteNotificationSetting: (
    articleId: string,
    email: string
  ) => Promise<void>;
}

type FormattedArticle = {
  id: string;
  title: string;
  content: string;
  name: string;
  replyCount: number;
  createdAt: string;
};

export function EmailNotificationList({
  getNotificationSettings,
  deleteNotificationSetting,
}: EmailNotificationListProps) {
  const [notificationValue, setNotificationValue] = useState('');
  const [notificationData, setNotificationData] = useState<FormattedArticle[]>(
    []
  );
  const { toast } = useToast();

  // メールアドレスが入力されたら通知設定を取得
  useEffect(() => {
    if (notificationValue) {
      getNotificationSettings(notificationValue)
        .then((settings) => {
          const formattedData = settings.map((setting) => ({
            id: setting.articles.id,
            title: setting.articles.title,
            content: setting.articles.content,
            name: '名無し',
            replyCount: setting.articles.replies_count,
            createdAt: new Date(setting.articles.created_at).toLocaleString(
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
          }));
          setNotificationData(formattedData);
        })
        .catch((error) => {
          console.error('通知設定の取得に失敗しました:', error);
        });
    }
  }, [notificationValue, getNotificationSettings]);

  // 通知設定の削除処理
  const handleDeleteNotification = async (articleId: string) => {
    try {
      await deleteNotificationSetting(articleId, notificationValue);

      // 通知設定を再取得
      const settings = await getNotificationSettings(notificationValue);
      const formattedData = settings.map((setting) => ({
        id: setting.articles.id,
        title: setting.articles.title,
        content: setting.articles.content,
        name: '名無し',
        replyCount: setting.articles.replies_count,
        createdAt: new Date(setting.articles.created_at).toLocaleString(
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
      }));
      setNotificationData(formattedData);

      toast({
        description: '通知設定を解除しました',
      });
    } catch (error) {
      console.error('通知設定の削除に失敗しました:', error);
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '通知設定の解除に失敗しました',
      });
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="notification-value">メールアドレス</Label>
          <Input
            id="notification-value"
            type="email"
            placeholder="example@example.com"
            value={notificationValue}
            onChange={(e) => setNotificationValue(e.target.value)}
            className="mt-1"
          />
        </div>
        <DataTable
          threadType="trade"
          columns={[
            ...columns,
            {
              id: 'actions',
              header: '操作',
              cell: ({ row }) => (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNotification(row.original.id)}
                >
                  削除
                </Button>
              ),
            },
          ]}
          data={notificationData}
          isVisibleCreateWithSearch={false}
        />
      </div>
    </div>
  );
}
