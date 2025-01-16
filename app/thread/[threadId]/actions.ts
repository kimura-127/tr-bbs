'use server';

import type { Database } from '@/types/supabase';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type Thread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  name: string;
};

export async function getThread(threadId: string): Promise<Thread | null> {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', threadId)
    .single();

  if (error) {
    console.error('Error fetching thread:', error);
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    content: article.content,
    name: '名無し',
    createdAt: new Date(article.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
  };
}

export async function createComment(
  threadId: string,
  formData: { content: string }
) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { error: commentError } = await supabase
    .from('replies')
    .insert({
      article_id: threadId,
      content: formData.content,
    })
    .select()
    .single();

  if (commentError) {
    return {
      error: 'コメントの投稿に失敗しました',
    };
  }

  revalidatePath(`/thread/${threadId}`);
  return { success: true };
}
