'use server';

import type { Payment } from '@/components/columns';
import { createClient } from '@/utils/supabase/server';

// 取引スレッド取得
export async function getTradingThreads(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('articles')
    .select(
      'id, title, content, user_id, updated_at, replies_count, name, device_user_id'
    )
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    name: `${article.name ?? '名無し'}${article.device_user_id ? `@${article.device_user_id}` : ''}`,
    replyCount: article.replies_count,
    createdAt: new Date(article.updated_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

// 雑談スレッド取得
export async function getFreeTalkThreads(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('free_talk_articles')
    .select(
      'id, title, content, user_id, updated_at, replies_count, name, device_user_id'
    )
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching free talk articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    name: `${article.name ?? '名無し'}${article.device_user_id ? `@${article.device_user_id}` : ''}`,
    replyCount: article.replies_count,
    createdAt: new Date(article.updated_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}

// アバタースレッド取得
export async function getAvatarThreads(): Promise<Payment[]> {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('avatar_articles')
    .select(
      'id, title, content, user_id, updated_at, replies_count, name, device_user_id'
    )
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching avatar articles:', error);
    return [];
  }

  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    content: article.content,
    name: `${article.name ?? '名無し'}${article.device_user_id ? `@${article.device_user_id}` : ''}`,
    replyCount: article.replies_count,
    createdAt: new Date(article.updated_at).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
  }));
}
