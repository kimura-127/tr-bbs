'use server';

import { checkBlockStatus } from '@/utils/checkBlockStatus';
import { generateFinalUserId } from '@/utils/generateUserIdentifier';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
interface CreateThreadData {
  title: string;
  name: string;
  content: string;
  image_urls?: string[];
  client_id: string;
}

// 取引スレッド作成
export async function createTradingThread(data: CreateThreadData) {
  const supabase = await createClient();

  // クライアントIDからユーザーIDを生成
  const deviceUserId = await generateFinalUserId(data.client_id);

  // ブロック状態をチェック
  const blockCheck = await checkBlockStatus(supabase, deviceUserId);
  if (blockCheck.error) {
    return blockCheck;
  }

  const { error } = await supabase.from('articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: deviceUserId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  return {
    success: true,
    warning: blockCheck.warning,
  };
}

// 雑談スレッド作成
export async function createFreeTalkThread(data: CreateThreadData) {
  const supabase = await createClient();

  // クライアントIDからユーザーIDを生成
  const deviceUserId = await generateFinalUserId(data.client_id);

  // ブロック状態をチェック
  const blockCheck = await checkBlockStatus(supabase, deviceUserId);
  if (blockCheck.error) {
    return blockCheck;
  }

  const { error } = await supabase.from('free_talk_articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: deviceUserId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/free-talk');
  return {
    success: true,
    warning: blockCheck.warning,
  };
}

// アバタースレッド作成
export async function createAvatarThread(data: CreateThreadData) {
  const supabase = await createClient();

  // クライアントIDからユーザーIDを生成
  const deviceUserId = await generateFinalUserId(data.client_id);

  // ブロック状態をチェック
  const blockCheck = await checkBlockStatus(supabase, deviceUserId);
  if (blockCheck.error) {
    return blockCheck;
  }

  const { error } = await supabase.from('avatar_articles').insert({
    title: data.title,
    name: data.name,
    content: data.content,
    image_urls: data.image_urls,
    device_user_id: deviceUserId,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/avatar');
  return {
    success: true,
    warning: blockCheck.warning,
  };
}
