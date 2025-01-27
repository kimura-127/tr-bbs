'use client';

import { DataTableSkeleton } from '@/components/data-table-skeleton';
import { Card } from '@/components/ui/card';
import type { NotificationSettingWithArticle } from '@/types';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { EmailNotificationList } from './email-notification-list';
import { PushNotificationList } from './push-notification-list';

interface NotificationSettingContentProps {
  getNotificationSettings: (
    email: string
  ) => Promise<NotificationSettingWithArticle[]>;
  deleteNotificationSetting: (
    articleId: string,
    email: string
  ) => Promise<void>;
}

export function NotificationSettingContent({
  getNotificationSettings,
  deleteNotificationSetting,
}: NotificationSettingContentProps) {
  return (
    <div>
      <div className="mb-4">
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
        <Tabs defaultValue="push" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="push">プッシュ通知</TabsTrigger>
            <TabsTrigger value="email">メール通知</TabsTrigger>
          </TabsList>
          <TabsContent value="push">
            <Card className="p-6">
              <Suspense fallback={<DataTableSkeleton />}>
                <PushNotificationList />
              </Suspense>
            </Card>
          </TabsContent>
          <TabsContent value="email">
            <Card className="p-6">
              <Suspense fallback={<DataTableSkeleton />}>
                <EmailNotificationList
                  getNotificationSettings={getNotificationSettings}
                  deleteNotificationSetting={deleteNotificationSetting}
                />
              </Suspense>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
