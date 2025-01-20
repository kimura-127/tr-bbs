'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateThreadInput {
  title: string;
  content: string;
  imageUrls?: string[];
}

export async function createThread(formData: CreateThreadInput) {
  const supabase = await createClient();

  // NOTE: スレッドを作成
  const { error: threadError } = await supabase
    .from('articles')
    .insert({
      title: formData.title,
      content: formData.content,
      image_urls: formData.imageUrls || [],
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
