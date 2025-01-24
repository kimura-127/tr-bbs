'use server';

import { sendCommentNotification } from '@/app/actions/sendCommentNotification';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Thread {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  image_urls: string[] | null;
  replies: {
    id: string;
    content: string;
    createdAt: string;
    image_urls: string[] | null;
  }[];
}

export async function getAvatarThread(
  threadId: string
): Promise<Thread | null> {
  const supabase = await createClient();

  const { data: article, error: articleError } = await supabase
    .from('avatar_articles')
    .select('*')
    .eq('id', threadId)
    .single();

  if (articleError) {
    console.error(articleError);
    return null;
  }

  const { data: replies, error: repliesError } = await supabase
    .from('avatar_replies')
    .select('*')
    .eq('article_id', threadId)
    .order('created_at', { ascending: true });

  if (repliesError) {
    console.error(repliesError);
    return null;
  }

  return {
    id: article.id,
    title: article.title,
    content: article.content,
    image_urls: article.image_urls,
    replies: replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      image_urls: reply.image_urls,
      createdAt: new Date(reply.created_at).toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    })),
    createdAt: new Date(article.created_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export async function createAvatarComment(
  threadId: string,
  formData: { content: string; imageUrls: string[] }
) {
  const supabase = await createClient();
  console.log('メール通知を送信');

  try {
    // 1. 現在の記事データを取得
    const { data: currentArticle, error: fetchError } = await supabase
      .from('avatar_articles')
      .select('title, replies_count')
      .eq('id', threadId)
      .single();

    if (fetchError) {
      return {
        error: '記事の取得に失敗しました',
      };
    }

    // 2. コメントを追加
    const { data: newReply, error: commentError } = await supabase
      .from('avatar_replies')
      .insert({
        article_id: threadId,
        content: formData.content,
        image_urls: formData.imageUrls,
      })
      .select()
      .single();

    if (commentError) {
      return {
        error: 'コメントの投稿に失敗しました',
      };
    }

    // 3. replies_countを1増やす
    const { error: articleError } = await supabase
      .from('avatar_articles')
      .update({
        replies_count: (currentArticle?.replies_count ?? 0) + 1,
      })
      .eq('id', threadId);

    if (articleError) {
      return {
        error: '記事の更新に失敗しました',
      };
    }

    // 4. メール通知を送信
    await sendCommentNotification({
      threadId,
      replyId: newReply.id,
      threadTitle: currentArticle.title,
      commentContent: formData.content,
    });

    revalidatePath(`/avatar/thread/${threadId}`);
    return { success: true };
  } catch (error) {
    console.error('Error in createComment:', error);
    return { error: 'エラーが発生しました' };
  }
}

export async function bumpAvatarThread(threadId: string) {
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from('avatar_articles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId);

  if (updateError) {
    return {
      error: 'スレッドの更新に失敗しました',
    };
  }

  revalidatePath('/avatar');
  revalidatePath(`/avatar/thread/${threadId}`);

  return { success: true };
}
