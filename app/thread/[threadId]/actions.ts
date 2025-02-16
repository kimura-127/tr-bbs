'use server';

import { sendCommentNotification } from '@/app/actions/sendCommentNotification';
import { checkBlockStatus } from '@/utils/checkBlockStatus';
import { generateFinalUserId } from '@/utils/generateUserIdentifier';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Thread {
  id: string;
  title: string;
  name: string;
  content: string;
  createdAt: string;
  image_urls: string[] | null;
  replies: {
    id: string;
    content: string;
    createdAt: string;
    image_urls: string[] | null;
    name: string;
  }[];
}

export async function getThread(threadId: string): Promise<Thread | null> {
  const supabase = await createClient();

  const { data: article, error: articleError } = await supabase
    .from('articles')
    .select('*')
    .eq('id', threadId)
    .single();

  if (articleError) {
    console.error(articleError);
    return null;
  }

  const { data: replies, error: repliesError } = await supabase
    .from('replies')
    .select('*')
    .eq('article_id', threadId)
    .order('created_at', { ascending: true });

  if (repliesError) {
    console.error(repliesError);
    return null;
  }

  // NOTE: 閲覧数をプラス1する処理（updated_atは更新しない）
  const { error: updateError } = await supabase
    .from('articles')
    .update({
      views_count: article.views_count + 1,
    })
    .eq('id', threadId);

  if (updateError) {
    console.error('閲覧数の更新に失敗しました:', updateError);
  }

  return {
    id: article.id,
    title: article.title,
    name: `${article.name ?? '名無し'}${article.device_user_id ? `@${article.device_user_id}` : ''}`,
    content: article.content,
    image_urls: article.image_urls,
    replies: replies.map((reply) => ({
      id: reply.id,
      content: reply.content,
      name: `${reply.name ?? '名無し'}${reply.device_user_id ? `@${reply.device_user_id}` : ''}`,
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

export async function createComment(
  threadId: string,
  formData: {
    content: string;
    imageUrls: string[];
    name: string;
    client_id: string;
  }
) {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  try {
    // 1. 現在の記事データを取得
    const { data: currentArticle, error: fetchError } = await supabase
      .from('articles')
      .select('title, replies_count')
      .eq('id', threadId)
      .single();

    if (fetchError) {
      console.error('記事取得エラー:', fetchError);
      return {
        error: '記事の取得に失敗しました',
      };
    }

    // クライアントIDからユーザーIDを生成
    const deviceUserId = await generateFinalUserId(formData.client_id);

    // ブロック状態をチェック
    const blockCheck = await checkBlockStatus(supabase, deviceUserId);
    if (blockCheck.error) {
      return blockCheck;
    }

    // 2. コメントを追加
    const { data: newReply, error: commentError } = await supabase
      .from('replies')
      .insert({
        article_id: threadId,
        content: formData.content,
        image_urls: formData.imageUrls,
        name: formData.name,
        device_user_id: deviceUserId,
      })
      .select()
      .single();

    if (commentError) {
      console.error('コメント作成エラー:', commentError);
      return {
        error: 'コメントの投稿に失敗しました',
      };
    }

    // 3. replies_countを1増やす
    const { error: articleError } = await supabase
      .from('articles')
      .update({
        replies_count: (currentArticle?.replies_count ?? 0) + 1,
      })
      .eq('id', threadId);

    if (articleError) {
      console.error('記事更新エラー:', articleError);
      return {
        error: '記事の更新に失敗しました',
      };
    }

    // 4. メール通知を送信
    sendCommentNotification({
      threadId,
      replyId: newReply.id,
      threadTitle: currentArticle.title,
      commentContent: formData.content,
    });

    // 5. プッシュ通知を送信
    fetch(`${baseUrl}/api/push-notification/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        threadId,
        title: `${currentArticle.title}に新しいコメント`,
        body: formData.content,
        url: `${baseUrl}/thread/${threadId}`,
      }),
    });

    revalidatePath(`/thread/${threadId}`);
    return { success: true, warning: blockCheck.warning };
  } catch (error) {
    console.error('Error in createComment:', error);
    return { error: 'エラーが発生しました' };
  }
}

export async function bumpThread(threadId: string, client_id: string) {
  const supabase = await createClient();

  // クライアントIDからユーザーIDを生成
  const deviceUserId = await generateFinalUserId(client_id);

  // ブロック状態をチェック
  const blockCheck = await checkBlockStatus(supabase, deviceUserId);
  if (blockCheck.error) {
    return blockCheck;
  }

  const { error: updateError } = await supabase
    .from('articles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId);

  if (updateError) {
    return {
      error: 'スレッドの更新に失敗しました',
    };
  }

  revalidatePath('/');
  revalidatePath(`/thread/${threadId}`);

  return {
    success: true,
    warning: blockCheck.warning,
  };
}
