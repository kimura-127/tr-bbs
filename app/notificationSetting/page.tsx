import { Suspense } from 'react';
import { NotificationSettingComponent } from './notificationSettingcomponent';

export default async function NotificationSettingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationSettingComponent />
    </Suspense>
  );
}
