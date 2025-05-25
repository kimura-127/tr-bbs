import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

export type ArticleWithReplies = Prisma.ArticleGetPayload<{
  include: {
    user: true
    replies: {
      include: {
        user: true
      }
    }
  }
}>

export type FreeTalkArticleWithReplies = Prisma.FreeTalkArticleGetPayload<{
  include: {
    user: true
    replies: {
      include: {
        user: true
      }
    }
  }
}>

export type AvatarArticleWithReplies = Prisma.AvatarArticleGetPayload<{
  include: {
    user: true
    replies: {
      include: {
        user: true
      }
    }
  }
}>

export async function getArticlesWithPagination(
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit
  
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
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
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.article.count()
  ])

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getFreeTalkArticlesWithPagination(
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit
  
  const [articles, total] = await Promise.all([
    prisma.freeTalkArticle.findMany({
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
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.freeTalkArticle.count()
  ])

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function getAvatarArticlesWithPagination(
  page: number = 1,
  limit: number = 10
) {
  const skip = (page - 1) * limit
  
  const [articles, total] = await Promise.all([
    prisma.avatarArticle.findMany({
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
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.avatarArticle.count()
  ])

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  }
}

export async function incrementViewCount(articleId: string, type: 'article' | 'freeTalk' | 'avatar') {
  switch (type) {
    case 'article':
      return prisma.article.update({
        where: { id: articleId },
        data: {
          viewsCount: {
            increment: 1
          }
        }
      })
    case 'freeTalk':
      return prisma.freeTalkArticle.update({
        where: { id: articleId },
        data: {
          viewsCount: {
            increment: 1
          }
        }
      })
    case 'avatar':
      return prisma.avatarArticle.update({
        where: { id: articleId },
        data: {
          viewsCount: {
            increment: 1
          }
        }
      })
  }
}

export async function getUserNotificationSettings(userId: string) {
  return prisma.notificationSetting.findUnique({
    where: { userId }
  })
}

export async function isUserBlocked(blockerUserId: string, blockedUserId: string): Promise<boolean> {
  const block = await prisma.userBlock.findUnique({
    where: {
      blockerUserId_blockedUserId: {
        blockerUserId,
        blockedUserId
      }
    }
  })
  return !!block
}

export async function isDeviceBlocked(blockerDeviceUserId: string, blockedDeviceUserId: string): Promise<boolean> {
  const block = await prisma.deviceBlock.findUnique({
    where: {
      blockerDeviceUserId_blockedDeviceUserId: {
        blockerDeviceUserId,
        blockedDeviceUserId
      }
    }
  })
  return !!block
}