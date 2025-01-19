import { Suspense } from 'react';
import { NotificationSettingComponent } from './NotificationSettingComponent';

export default async function NotificationSettingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationSettingComponent />
    </Suspense>
  );
}
