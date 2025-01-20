import { NotificationSettingForm } from '@/components/notification-setting/notification-setting-form';
import { deleteNotificationSetting, getNotificationSettings } from './actions';

export default function NotificationSettingPage() {
  return (
    <div className="container mx-auto py-10">
      <NotificationSettingForm
        getNotificationSettings={getNotificationSettings}
        deleteNotificationSetting={deleteNotificationSetting}
      />
    </div>
  );
}
