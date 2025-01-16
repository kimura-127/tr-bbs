import { useEffect, useState } from 'react';

const STORAGE_KEY = 'readThreadIds';

export function useReadThreads() {
  const [readThreadIds, setReadThreadIds] = useState<string[]>([]);

  useEffect(() => {
    // 初期化時にSessionStorageから閲覧済み記事IDを取得
    const storedIds = sessionStorage.getItem(STORAGE_KEY);
    if (storedIds) {
      setReadThreadIds(JSON.parse(storedIds));
    }
  }, []);

  const markAsRead = (threadId: string) => {
    if (!readThreadIds.includes(threadId)) {
      const newReadThreadIds = [...readThreadIds, threadId];
      setReadThreadIds(newReadThreadIds);
      // SessionStorageに保存
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newReadThreadIds));
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
