'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

interface CreateThreadData {
  title: string
  name: string
  content: string
  password?: number | null
  imageUrls?: string[]
  deviceUserId: string
}

export async function createTradingThreadWithSupabase(data: CreateThreadData) {
  try {
    const supabase = await createClient()
    
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        image_urls: data.imageUrls || [],
        device_user_id: data.deviceUserId,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create trading thread:', error)
      return { error: 'スレッドの作成に失敗しました' }
    }

    revalidatePath('/')
    return { success: true, article }
  } catch (error) {
    console.error('Failed to create trading thread:', error)
    return { error: 'スレッドの作成に失敗しました' }
  }
}

export async function createFreeTalkThreadWithSupabase(data: CreateThreadData) {
  try {
    const supabase = await createClient()
    
    const { data: article, error } = await supabase
      .from('free_talk_articles')
      .insert({
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        image_urls: data.imageUrls || [],
        device_user_id: data.deviceUserId,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create free talk thread:', error)
      return { error: 'スレッドの作成に失敗しました' }
    }

    revalidatePath('/free-talk')
    return { success: true, article }
  } catch (error) {
    console.error('Failed to create free talk thread:', error)
    return { error: 'スレッドの作成に失敗しました' }
  }
}

export async function createAvatarThreadWithSupabase(data: CreateThreadData) {
  try {
    const supabase = await createClient()
    
    const { data: article, error } = await supabase
      .from('avatar_articles')
      .insert({
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        image_urls: data.imageUrls || [],
        device_user_id: data.deviceUserId,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create avatar thread:', error)
      return { error: 'スレッドの作成に失敗しました' }
    }

    revalidatePath('/avatar')
    return { success: true, article }
  } catch (error) {
    console.error('Failed to create avatar thread:', error)
    return { error: 'スレッドの作成に失敗しました' }
  }
}

interface CreateReplyData {
  content: string
  articleId: string
  deviceUserId: string
  imageUrls?: string[]
}

export async function createReplyWithSupabase(data: CreateReplyData) {
  try {
    const supabase = await createClient()
    
    const { data: reply, error } = await supabase
      .from('replies')
      .insert({
        content: data.content,
        article_id: data.articleId,
        device_user_id: data.deviceUserId,
        image_urls: data.imageUrls || [],
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create reply:', error)
      return { error: '返信の作成に失敗しました' }
    }

    revalidatePath(`/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function createFreeTalkReplyWithSupabase(data: CreateReplyData) {
  try {
    const supabase = await createClient()
    
    const { data: reply, error } = await supabase
      .from('free_talk_replies')
      .insert({
        content: data.content,
        article_id: data.articleId,
        device_user_id: data.deviceUserId,
        image_urls: data.imageUrls || [],
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create free talk reply:', error)
      return { error: '返信の作成に失敗しました' }
    }

    revalidatePath(`/free-talk/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create free talk reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function createAvatarReplyWithSupabase(data: CreateReplyData) {
  try {
    const supabase = await createClient()
    
    const { data: reply, error } = await supabase
      .from('avatar_replies')
      .insert({
        content: data.content,
        article_id: data.articleId,
        device_user_id: data.deviceUserId,
        image_urls: data.imageUrls || [],
      })
      .select('*')
      .single()

    if (error) {
      console.error('Failed to create avatar reply:', error)
      return { error: '返信の作成に失敗しました' }
    }

    revalidatePath(`/avatar/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create avatar reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function getArticleByIdWithSupabase(id: string) {
  try {
    const supabase = await createClient()
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        replies(
          *,
          user:app_users(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to get article:', error)
      return { error: 'スレッドの取得に失敗しました' }
    }

    if (!article) {
      return { error: 'スレッドが見つかりません' }
    }

    return { success: true, article }
  } catch (error) {
    console.error('Failed to get article:', error)
    return { error: 'スレッドの取得に失敗しました' }
  }
}