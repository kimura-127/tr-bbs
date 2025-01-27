import { ThreadHeader } from '@/components/ThreadHeader';
import { NotificationSettingContent } from '@/components/ui/notification-setting/notification-setting-content';
import type { Metadata } from 'next';
import { deleteNotificationSetting, getNotificationSettings } from './actions';

export const metadata: Metadata = {
  title: '通知設定 | チョコットランド取引掲示板',
  description:
    'チョコットランド（チョコラン）の取引掲示板の通知設定ページです。アイテムや装備の取引に関する通知を設定できます。',
};

export default function NotificationSettingPage() {
  return (
    <div className="container mx-auto py-4">
      <ThreadHeader title="通知設定" />
      <NotificationSettingContent
        getNotificationSettings={getNotificationSettings}
        deleteNotificationSetting={deleteNotificationSetting}
      />
    </div>
  );
}
