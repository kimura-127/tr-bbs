// Service Worker登録時の処理
self.addEventListener('install', (event) => {
  console.log('Service Worker インストール:', event);
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker アクティブ化:', event);
  event.waitUntil(clients.claim());
});

// プッシュ通知受信時の処理
self.addEventListener('push', (event) => {
  console.log('プッシュイベント受信:', event);

  let notificationData;
  try {
    if (!event.data) {
      console.log('プッシュデータなし、デフォルト通知を表示');
      notificationData = {
        title: '新しい通知',
        body: 'コンテンツを確認してください',
      };
    } else {
      console.log('受信したデータ:', event.data.text());
      try {
        notificationData = event.data.json();
        console.log('JSONパース成功:', notificationData);
      } catch (parseError) {
        console.log('JSONパース失敗、テキストとして処理:', parseError);
        const text = event.data.text();
        notificationData = {
          title: '新しい通知',
          body: text,
        };
      }
    }

    const options = {
      body: notificationData.body || '詳細はクリックして確認してください',
      data: {
        url: notificationData.url || '/',
      },
      tag: 'comment-notification',
      renotify: true,
      vibrate: [200, 100, 200],
      requireInteraction: true,
      actions: [
        { action: 'open', title: '開く' },
        { action: 'close', title: '閉じる' },
      ],
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      timestamp: Date.now(),
    };

    console.log('通知を表示します:', {
      title: notificationData.title,
      options: options,
    });

    event.waitUntil(
      self.registration
        .showNotification(notificationData.title, options)
        .then(() => {
          console.log('通知表示成功');
          return self.registration.getNotifications();
        })
        .then((notifications) => {
          console.log('現在の通知一覧:', notifications);
        })
        .catch((error) => {
          console.error('通知表示エラー:', error);
          return self.registration.showNotification('通知エラー', {
            body: 'プッシュ通知の表示中にエラーが発生しました',
          });
        })
    );
  } catch (error) {
    console.error('プッシュイベント処理エラー:', error);
    event.waitUntil(
      self.registration.showNotification('エラー', {
        body: 'プッシュ通知の処理中にエラーが発生しました',
      })
    );
  }
});

// プッシュ通知クリック時の処理
self.addEventListener('notificationclick', (event) => {
  console.log('通知クリック:', event);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 既存のウィンドウがあれば、そこにフォーカス
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 新しいウィンドウを開く
        return clients.openWindow(urlToOpen);
      })
      .catch((error) => console.error('通知クリック処理エラー:', error))
  );
});

// メッセージ受信時の処理を修正
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // レスポンスを返すための関数を用意
    const respond = () => {
      event.ports[0]?.postMessage({
        type: 'WORKER_READY',
        success: true,
      });
    };

    event.waitUntil(
      Promise.all([self.skipWaiting(), clients.claim()])
        .then(() => {
          respond();
          return self.clients.matchAll();
        })
        .then((clients) => {
          // biome-ignore lint/complexity/noForEach: <explanation>
          clients.forEach((client) => {
            client.postMessage({
              type: 'WORKER_READY',
              success: true,
            });
          });
        })
    );
  }
});
