'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type Reply = {
  id: string;
  content: string;
  createdAt: string;
};

export type Thread = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  name: string;
  replies: Reply[];
};

export async function getThread(threadId: string): Promise<Thread | null> {
  const supabase = await createClient();

  // 記事の取得
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('id, title, content, created_at')
    .eq('id', threadId)
    .single();

  if (articleError) {
    console.error('Error fetching article:', articleError);
    return null;
  }

  // 返信の取得
  const { data: replies, error: repliesError } = await supabase
    .from('replies')
    .select('id, content, created_at')
    .eq('article_id', threadId)
    .order('created_at', { ascending: true });

  if (repliesError) {
    console.error('Error fetching replies:', repliesError);
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
    replies: replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      createdAt: new Date(reply.created_at).toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
      }),
    })),
  };
}

export async function createComment(
  threadId: string,
  formData: { content: string }
) {
  const supabase = await createClient();

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
