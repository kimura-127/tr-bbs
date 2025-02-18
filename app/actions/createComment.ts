import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { sendCommentNotification } from './sendCommentNotification';

export async function createComment(
  threadId: string,
  formData: { content: string }
) {
  const supabase = await createClient();
  console.log('メール通知を送信');
  try {
    // 1. 現在の記事データを取得
    const { data: currentArticle, error: fetchError } = await supabase
      .from('articles')
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

    // 3. replies_countを1増やす
    const { error: articleError } = await supabase
      .from('articles')
      .update({
        updated_at: new Date().toISOString(),
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

    revalidatePath(`/thread/${threadId}`);
    return { success: true };
  } catch (error) {
    console.error('Error in createComment:', error);
    return { error: 'エラーが発生しました' };
  }
}
