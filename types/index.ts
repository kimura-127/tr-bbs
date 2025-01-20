export interface Article {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  replies_count: number;
}

export interface NotificationSetting {
  id: string;
  article_id: string;
  email: string;
  type: 'email' | 'line';
  created_at: string;
  articles: Article;
}

export type NotificationSettingWithArticle = {
  article_id: string;
  articles: Article;
};
