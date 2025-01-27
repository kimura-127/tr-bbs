# チョコットランド総合掲示板

## はじめに
チョコットランド総合掲示板は、オンラインゲーム「チョコットランド」のプレイヤー間での装備やアイテムの取引をスムーズに行うためのプラットフォームです。
従来の取引方法の課題を解決し、より安全で効率的な取引環境を提供することを目指しています。

## コンセプト
簡単でスピーディーな取引環境の実現

- **利便性**: 直感的なUI/UXによる簡単な操作性
- **即時性**: プッシュ通知やメール通知による素早い情報伝達

## 掲示板URL
https://cl-bbs.com

## デモ動画
### YouTube
[![チョコットランド総合掲示板](http://img.youtube.com/vi/KviR4u3XIXI/0.jpg)](https://www.youtube.com/watch?v=KviR4u3XIXI)

### スクリーンショット
#### トップページ
<img src="/public/images/toppage.png" width="800" alt="トップページ" />

#### 通知設定
<img src="/public/images/notification-setting.png" width="800" alt="通知設定" />

#### スマートフォン表示
<div align="center">
  <img src="screenshots/mobile.png" width="300" alt="スマートフォン表示" />
</div>

## 概要
### 主な機能
- スレッド作成
- コメント投稿
- 画像投稿
- 通知機能（プッシュ通知/メール通知）
- レスポンシブ対応

### 特徴
- モダンなUI/UXデザイン
- リアルタイムな通知システム
- 柔軟な検索機能
- スマートフォン対応

## 使用した技術
### フロントエンド
- Next.js 15（App Router）
- TypeScript
- Tailwind CSS
- shadcn/ui

### バックエンド
- Supabase
  - データベース
  - ストレージ

### インフラ
- Vercel（ホスティング）
- Supabase（BaaS）

### AIツール
- Cursor（次世代AI搭載コードエディタ）
- Cline（AIエージェント）
- Bolt.new()（AIコード生成）
- ChatGPT（生成AI）
- Claude（生成AI）
- Gemini Deep Research（情報収集）

### その他
- pnpm(パッケージマネージャー)
- biome(リンター/フォーマッター)

## 実装予定の機能
- [ ] セッション管理による新規コメントの表示
- [ ] LINEによる通知機能
- [ ] AIを活用したアイテムの相場検索
- [ ] ポイント制による荒らし対策
- [ ] 通報システム

## おわりに
本プロジェクトは、チョコットランドプレイヤーのコミュニティをより活性化させ、
快適な取引環境を提供することを目指しています。
今後も新機能の追加やユーザーフィードバックを基にした改善を継続的に行っていく予定です。
