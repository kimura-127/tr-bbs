'use server';

import type { NotificationSettingWithArticle } from '@/types';
import { createClient } from '@/utils/supabase/server';

// サーバーアクション: 通知設定の取得
export async function getNotificationSettings(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notification_settings')
    .select(`
      id,
      thread_id,
      email,
      type,
      created_at,
      updated_at,
      articles (
        id,
        title,
        content,
        created_at,
        replies_count
      )
    `)
    .eq('email', email)
    .eq('type', 'email');

  if (error) {
    throw error;
  }

  return data as unknown as NotificationSettingWithArticle[];
}

// サーバーアクション: 通知設定の削除
export async function deleteNotificationSetting(
  articleId: string,
  email: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('notification_settings')
    .delete()
    .eq('thread_id', articleId)
    .eq('email', email)
    .eq('type', 'email');

  if (error) {
    throw error;
  }
}
