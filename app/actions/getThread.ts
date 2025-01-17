'use server';

import type { Payment } from '@/components/columns';
import { createClient } from '@/utils/supabase/server';

export async function getThreads(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, user_id, updated_at, replies_count')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    name: '名無し',
    replyCount: article.replies_count,
    createdAt: new Date(article.updated_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}
