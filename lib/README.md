# Prisma Integration

このプロジェクトではSupabaseと併用してPrismaを使用しています。

## セットアップ

1. 環境変数を設定:
```bash
DATABASE_URL="postgresql://username:password@hostname:port/database?schema=public"
```

2. Prismaクライアントを生成:
```bash
npm run prisma:generate
```

## 使用方法

### 基本的な使用方法

```typescript
import { prisma } from '@/lib/prisma'

// 記事を取得
const articles = await prisma.article.findMany({
  include: {
    user: true,
    replies: true
  }
})

// 新しい記事を作成
const newArticle = await prisma.article.create({
  data: {
    title: 'タイトル',
    content: '内容',
    userId: 'user-id'
  }
})
```

### ユーティリティ関数の使用

```typescript
import { getArticlesWithPagination, incrementViewCount } from '@/lib/prisma-utils'

// ページネーション付きで記事を取得
const { articles, total, totalPages } = await getArticlesWithPagination(1, 10)

// ビュー数を増加
await incrementViewCount('article-id', 'article')
```

## データベースとの同期

PrismaスキーマはSupabaseのマイグレーションと同期する必要があります。

### スキーマを更新する場合

1. Supabaseマイグレーションを作成・実行
2. Prismaスキーマを手動で更新するか、`prisma db pull`を使用
3. `npm run prisma:generate`でクライアントを再生成

## ベストプラクティス

1. **グローバルPrismaクライアント**: `lib/prisma.ts`では開発環境でのホットリロード対応のためグローバルインスタンスを使用
2. **型安全性**: Prismaの生成された型を活用してTypeScriptの型安全性を確保
3. **リレーションの活用**: `include`オプションを使用して関連データを効率的に取得
4. **ページネーション**: 大量データに対してはページネーションを実装
5. **エラーハンドリング**: try-catchブロックでPrismaエラーを適切に処理

## 注意事項

- SupabaseのRLSポリシーはPrismaでは直接適用されません
- 認証・認可ロジックはアプリケーション層で実装する必要があります
- Supabaseの関数やトリガーはPrismaでは管理されません