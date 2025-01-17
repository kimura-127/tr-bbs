'use server';

import type { Payment } from '@/components/columns';
import { createClient } from '@/utils/supabase/server';

export async function getThreads(): Promise<Payment[]> {
  // NOTE: 一時的にSupabaseアクセスをコメントアウト
  // const supabase = await createClient();

  // const { data: articles, error } = await supabase
  //   .from('articles')
  //   .select(`
  //     id,
  //     title,
  //     user_id,
  //     created_at,
  //     replies_count
  //   `)
  //   .order('created_at', { ascending: false });

  // if (error) {
  //   console.error('Error fetching articles:', error);
  //   return [];
  // }

  // ダミーデータを返す
  const dummyArticles = Array.from({ length: 50 }, (_, i) => ({
    id: `dummy-${i + 1}`,
    title: `テストスレッド ${i + 1}`,
    name: '名無し',
    replyCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - i * 86400000).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
  }));

  return dummyArticles;
}
