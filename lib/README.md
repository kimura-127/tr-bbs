# Database Access Strategy

このプロジェクトではSupabaseを主要なデータベースアクセス方法として使用し、Prismaはスキーマ管理の補助として利用しています。

## 統一されたアプローチ

権限エラーを避けるため、**すべてのデータベースアクセスはSupabase SDKを通して行います**。

### 使用方法

#### Supabaseクライアント（推奨）

```typescript
import { createClient } from '@/utils/supabase/server'

// 記事を取得（RLSポリシー適用）
const supabase = await createClient()
const { data: articles, error } = await supabase
  .from('articles')
  .select('*')

// 新しい記事を作成
const { data: article, error } = await supabase
  .from('articles')
  .insert({
    title: 'タイトル',
    content: '内容',
    device_user_id: 'device-id'
  })
```

#### 統一されたアクション関数

```typescript
import { 
  createTradingThreadWithSupabase,
  createFreeTalkThreadWithSupabase,
  getArticleByIdWithSupabase 
} from '@/lib/supabase-actions'

// スレッド作成
const result = await createTradingThreadWithSupabase({
  title: 'タイトル',
  name: '名前',
  content: '内容',
  deviceUserId: 'device-id'
})

// 記事取得
const { article } = await getArticleByIdWithSupabase('article-id')
```

## Prismaの役割

Prismaは以下の用途で使用します：

1. **スキーマ定義**: TypeScript型の生成
2. **開発ツール**: データベーススキーマの管理
3. **マイグレーション確認**: Supabaseとの整合性チェック

```bash
# スキーマから型を生成
npm run prisma:generate

# スキーマをデータベースと同期
npm run prisma:db:pull
```

## セキュリティとRLS

- **Supabase SDK**: RLSポリシーが自動的に適用される
- **anon key**: 匿名ユーザー権限でアクセス
- **権限統一**: すべてのクエリが同じ権限レベルで実行

## ベストプラクティス

1. **Supabaseファースト**: 新機能は必ずSupabase SDKを使用
2. **権限一貫性**: 異なるクライアントを混在させない
3. **RLS活用**: データベースレベルでセキュリティを確保
4. **型安全性**: Prismaスキーマから生成される型を活用

## 注意事項

- **重要**: Prismaクライアントを直接データアクセスに使用しない
- **混在禁止**: PrismaとSupabaseのクライアントを同じ処理で混在させない
- **権限エラー回避**: すべてのアクセスはSupabase anon keyレベルで統一