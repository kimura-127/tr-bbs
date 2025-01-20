'use server';

import type { NotificationSettingWithArticle } from '@/types';
import { createClient } from '@/utils/supabase/server';

// サーバーアクション: 通知設定の取得
export async function getNotificationSettings(
  email: string
): Promise<NotificationSettingWithArticle[]> {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from('notification_settings')
    .select(`
      thread_id,
      articles (
        id,
        title,
        user_id,
        created_at,
        updated_at,
        replies_count
      )
    `)
    .eq('email', email)
    .eq('type', 'email');

  if (error) {
    console.error('通知設定の取得エラー:', error);
    throw new Error('通知設定の取得に失敗しました');
  }

  if (!settings) {
    return [];
  }

  return settings;
}

// サーバーアクション: 通知設定の削除
export async function deleteNotificationSetting(
  threadId: string,
  email: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('notification_settings')
    .delete()
    .match({
      thread_id: threadId,
      email: email,
      type: 'email',
    });

  if (error) {
    console.error('通知設定の削除エラー:', error);
    throw new Error('通知設定の削除に失敗しました');
  }
}
