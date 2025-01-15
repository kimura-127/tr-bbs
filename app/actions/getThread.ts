import type { Payment } from '@/components/columns';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getThreads(): Promise<Payment[]> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, user_id, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  const articlesWithComments = await Promise.all(
    articles.map(async (article) => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', article.id);

      return {
        title: article.title,
        name: '名無し',
        replyCount: count ?? 0,
        createdAt: new Date(article.created_at),
      };
    })
  );

  return articlesWithComments;
}
