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

  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      replies (
        id,
        content,
        created_at
      )
    `)
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
    replies: article.replies.map((reply) => ({
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

  const { data: updateData, error: updateError } = await supabase
    .from('articles')
    .update({
      replies_count: 1,
    })
    .eq('id', threadId);
  console.log(updateData, updateError);
  if (commentError || updateError) {
    return {
      error: 'コメントの投稿に失敗しました',
    };
  }

  revalidatePath(`/thread/${threadId}`);
  return { success: true };
}
