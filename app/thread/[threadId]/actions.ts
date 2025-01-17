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
  // NOTE: 一時的にSupabaseアクセスをコメントアウト
  // const supabase = await createClient();

  // const { data: article, error } = await supabase
  //   .from('articles')
  //   .select(`
  //     *,
  //     replies (
  //       id,
  //       content,
  //       created_at
  //     )
  //   `)
  //   .eq('id', threadId)
  //   .single();

  // if (error) {
  //   console.error('Error fetching thread:', error);
  //   return null;
  // }

  // ダミーデータを返す
  const dummyReplies = Array.from({ length: 20 }, (_, i) => ({
    id: `reply-${i + 1}`,
    content: `これはテスト返信 ${i + 1} です。`,
    createdAt: new Date(Date.now() - i * 3600000).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
  }));

  return {
    id: threadId,
    title: 'テストスレッド',
    content: 'これはテストスレッドの本文です。',
    name: '名無し',
    createdAt: new Date().toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
    }),
    replies: dummyReplies,
  };
}

export async function createComment(
  threadId: string,
  formData: { content: string }
) {
  // NOTE: 一時的にSupabaseアクセスをコメントアウト
  // const supabase = await createClient();

  // const { error: commentError } = await supabase
  //   .from('replies')
  //   .insert({
  //     article_id: threadId,
  //     content: formData.content,
  //   })
  //   .select()
  //   .single();

  // const { data: updateData, error: updateError } = await supabase
  //   .from('articles')
  //   .update({
  //     replies_count: 1,
  //   })
  //   .eq('id', threadId);
  // console.log(updateData, updateError);
  // if (commentError || updateError) {
  //   return {
  //     error: 'コメントの投稿に失敗しました',
  //   };
  // }

  // ダミーの成功レスポンスを返す
  revalidatePath(`/thread/${threadId}`);
  return { success: true };
}
