import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const COOKIE_KEY = 'readThreadIds';
const COOKIE_EXPIRES_DAYS = 7; // Cookieの有効期限を7日に設定

export function useReadThreads() {
  const [readThreadIds, setReadThreadIds] = useState<string[]>([]);

  useEffect(() => {
    // 初期化時にCookieから閲覧済み記事IDを取得
    const storedIds = Cookies.get(COOKIE_KEY);
    if (storedIds) {
      setReadThreadIds(JSON.parse(storedIds));
    }
  }, []);

  const markAsRead = (threadId: string) => {
    if (!readThreadIds.includes(threadId)) {
      const newReadThreadIds = [...readThreadIds, threadId];
      setReadThreadIds(newReadThreadIds);
      // Cookieに保存（7日間有効）
      Cookies.set(COOKIE_KEY, JSON.stringify(newReadThreadIds), {
        expires: COOKIE_EXPIRES_DAYS,
        sameSite: 'strict',
        secure: true,
      });
    }
  };

  const isRead = (threadId: string) => {
    return readThreadIds.includes(threadId);
  };

  return {
    markAsRead,
    isRead,
  };
}
