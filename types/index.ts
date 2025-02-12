import type { Database } from './supabase';

export type Article = Database['public']['Tables']['articles']['Row'];
export type NotificationSetting =
  Database['public']['Tables']['notification_settings']['Row'];
export type PushSubscription =
  Database['public']['Tables']['push_subscriptions']['Row'];

export type FormattedArticle = {
  id: string;
  title: string;
  content: string;
  name: string;
  replyCount: number;
  createdAt: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  image_urls: string[] | null;
  replies_count: number;
};

export type NotificationSettingWithArticle = NotificationSetting & {
  articles: Article;
};

export type PushSubscriptionWithArticle = {
  id: string;
  endpoint: string;
  thread_id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  auth: string;
  p256dh: string;
  articles: FormattedArticle;
};

export type ThreadType = 'free-talk' | 'avatar' | 'trade';

export type DeviceInfo = {
  renderHash: string | null;
  precision: {
    rangeMin: number | null;
    rangeMax: number | null;
    precision: number | null;
  };
};

// 戻り値の型を定義
export interface CreateResult {
  error?: string;
  success?: boolean;
  warning?: string;
}
