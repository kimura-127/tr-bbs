'use server';

import type { Payment } from '@/components/columns';
import { createClient } from '@/utils/supabase/server';

export async function getThreads(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, user_id, created_at, replies_count')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    name: '名無し',
    replyCount: article.replies_count,
    createdAt: new Date(article.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
  }));
}
