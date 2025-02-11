'use server';

import type { DeviceInfo } from '@/types';
import { generateMonthlyUserId } from '@/utils/generateMonthlyUserId';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

interface CreateThreadData {
  title: string;
  name: string;
  content: string;
  image_urls?: string[];
  device_info: DeviceInfo;
}

// 取引スレッド作成
export async function createTradingThread(data: CreateThreadData) {
  const supabase = await createClient();

  const monthlyUserId = generateMonthlyUserId(data.device_info);

  const { error } = await supabase.from('articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: monthlyUserId,
  });

  if (error) {
    console.error('Error creating trading thread:', error);
    return { error: error.message };
  }

  revalidatePath('/');
  return { success: true };
}

// 雑談スレッド作成
export async function createFreeTalkThread(data: CreateThreadData) {
  const supabase = await createClient();

  const monthlyUserId = generateMonthlyUserId(data.device_info);

  const { error } = await supabase.from('free_talk_articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: monthlyUserId,
  });

  if (error) {
    console.error('Error creating free talk thread:', error);
    return { error: error.message };
  }

  revalidatePath('/free-talk');
  return { success: true };
}

// アバタースレッド作成
export async function createAvatarThread(data: CreateThreadData) {
  const supabase = await createClient();

  const monthlyUserId = generateMonthlyUserId(data.device_info);

  const { error } = await supabase.from('avatar_articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: monthlyUserId,
  });

  if (error) {
    console.error('Error creating avatar thread:', error);
    return { error: error.message };
  }

  revalidatePath('/avatar');
  return { success: true };
}
