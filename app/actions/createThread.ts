'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createThread(formData: {
  title: string;
  content: string;
}) {
  const supabase = await createClient();

  // NOTE: スレッドを作成
  const { error: threadError } = await supabase
    .from('articles')
    .insert({
      title: formData.title,
      content: formData.content,
    })
    .select()
    .single();

  if (threadError) {
    return {
      error: 'スレッドの作成に失敗しました',
    };
  }

  // NOTE: キャッシュを更新してトップページの記事情報を更新
  revalidatePath('/');
  return { success: true };
}
