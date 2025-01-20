'use client';

import { DataTable } from '@/components/data-table';
import { notificationColumns } from '@/components/notification-setting/columns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Article, NotificationSettingWithArticle } from '@/types';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

interface NotificationSettingFormProps {
  getNotificationSettings: (
    email: string
  ) => Promise<NotificationSettingWithArticle[]>;
  deleteNotificationSetting: (
    articleId: string,
    email: string
  ) => Promise<void>;
}

export function NotificationSettingForm({
  getNotificationSettings,
  deleteNotificationSetting,
}: NotificationSettingFormProps) {
  const [notificationType, setNotificationType] = useState('email');
  const [notificationValue, setNotificationValue] = useState('');
  const [notificationData, setNotificationData] = useState<Article[]>([]);

  // 通知設定の取得
  const fetchNotificationSettings = useCallback(async () => {
    try {
      const settings = await getNotificationSettings(notificationValue);
      const articles = settings
        .map((setting) => setting.articles)
        .filter((article): article is Article => article !== null);
      setNotificationData(articles);
    } catch (error) {
      console.error('通知設定の取得に失敗しました:', error);
    }
  }, [getNotificationSettings, notificationValue]);

  // 通知設定の削除処理
  const handleDeleteNotification = async (articleId: string) => {
    try {
      await deleteNotificationSetting(articleId, notificationValue);
      await fetchNotificationSettings();
    } catch (error) {
      console.error('通知設定の削除に失敗しました:', error);
    }
  };

  // メールアドレスが入力されたら通知設定を取得
  useEffect(() => {
    if (notificationValue && notificationType === 'email') {
      fetchNotificationSettings();
    }
  }, [notificationValue, notificationType, fetchNotificationSettings]);

  // カラムに削除ボタンを追加
  const columnsWithDelete: ColumnDef<Article>[] = [
    ...notificationColumns,
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
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="bg-gray-700 text-base pl-8 h-12 flex items-center rounded-lg mb-2">
          <h1
            className="max-md:text-sm text-base
             font-semibold text-white tracking-wider leading-7"
          >
            通知設定
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
                通知設定
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">通知設定</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">通知方法の選択</h3>
            <RadioGroup
              defaultValue="email"
              onValueChange={setNotificationType}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email">メール通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="line" id="line" disabled />
                <Label htmlFor="line">LINE通知（準備中）</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="notification-value">
              {notificationType === 'email' ? 'メールアドレス' : 'LINE ID'}
            </Label>
            <Input
              id="notification-value"
              type={notificationType === 'email' ? 'email' : 'text'}
              placeholder={
                notificationType === 'email' ? 'example@example.com' : 'LINE ID'
              }
              value={notificationValue}
              onChange={(e) => setNotificationValue(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">通知スレッド一覧</h3>
            <DataTable
              columns={columnsWithDelete}
              data={notificationData}
              isVisibleSearch={false}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
