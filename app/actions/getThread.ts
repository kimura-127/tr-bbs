'use server';

import type { Payment } from '@/components/columns';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getThreads(): Promise<Payment[]> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: articles, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      user_id,
      created_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    name: '名無し',
    replyCount: 0,
    createdAt: new Date(article.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
  }));
}
