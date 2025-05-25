'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'

interface CreateThreadData {
  title: string
  name: string
  content: string
  password?: number | null
  imageUrls?: string[]
  deviceUserId: string
}

export async function createTradingThreadWithPrisma(data: CreateThreadData) {
  try {
    const article = await prisma.article.create({
      data: {
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        imageUrls: data.imageUrls || [],
        deviceUserId: data.deviceUserId,
      },
      include: {
        user: true
      }
    })

    revalidatePath('/')
    return { success: true, article }
  } catch (error) {
    console.error('Failed to create trading thread:', error)
    return { error: 'スレッドの作成に失敗しました' }
  }
}

export async function createFreeTalkThreadWithPrisma(data: CreateThreadData) {
  try {
    const article = await prisma.freeTalkArticle.create({
      data: {
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        imageUrls: data.imageUrls || [],
        deviceUserId: data.deviceUserId,
      },
      include: {
        user: true
      }
    })

    revalidatePath('/free-talk')
    return { success: true, article }
  } catch (error) {
    console.error('Failed to create free talk thread:', error)
    return { error: 'スレッドの作成に失敗しました' }
  }
}

export async function createAvatarThreadWithPrisma(data: CreateThreadData) {
  try {
    const article = await prisma.avatarArticle.create({
      data: {
        title: data.title,
        name: data.name,
        content: data.content,
        password: data.password,
        imageUrls: data.imageUrls || [],
        deviceUserId: data.deviceUserId,
      },
      include: {
        user: true
      }
    })

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

export async function createReplyWithPrisma(data: CreateReplyData) {
  try {
    const reply = await prisma.reply.create({
      data: {
        content: data.content,
        articleId: data.articleId,
        deviceUserId: data.deviceUserId,
        imageUrls: data.imageUrls || [],
      },
      include: {
        user: true,
        article: true
      }
    })

    revalidatePath(`/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function createFreeTalkReplyWithPrisma(data: CreateReplyData) {
  try {
    const reply = await prisma.freeTalkReply.create({
      data: {
        content: data.content,
        articleId: data.articleId,
        deviceUserId: data.deviceUserId,
        imageUrls: data.imageUrls || [],
      },
      include: {
        user: true,
        article: true
      }
    })

    revalidatePath(`/free-talk/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create free talk reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function createAvatarReplyWithPrisma(data: CreateReplyData) {
  try {
    const reply = await prisma.avatarReply.create({
      data: {
        content: data.content,
        articleId: data.articleId,
        deviceUserId: data.deviceUserId,
        imageUrls: data.imageUrls || [],
      },
      include: {
        user: true,
        article: true
      }
    })

    revalidatePath(`/avatar/thread/${data.articleId}`)
    return { success: true, reply }
  } catch (error) {
    console.error('Failed to create avatar reply:', error)
    return { error: '返信の作成に失敗しました' }
  }
}

export async function getArticleByIdWithPrisma(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        user: true,
        replies: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    if (!article) {
      return { error: 'スレッドが見つかりません' }
    }

    return { success: true, article }
  } catch (error) {
    console.error('Failed to get article:', error)
    return { error: 'スレッドの取得に失敗しました' }
  }
}