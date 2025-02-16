-- articlesテーブルにviews_countカラムを追加
ALTER TABLE articles
ADD COLUMN views_count INTEGER NOT NULL DEFAULT 0;

-- avatar_articlesテーブルにviews_countカラムを追加
ALTER TABLE avatar_articles
ADD COLUMN views_count INTEGER NOT NULL DEFAULT 0;

-- free_talk_articlesテーブルにviews_countカラムを追加
ALTER TABLE free_talk_articles
ADD COLUMN views_count INTEGER NOT NULL DEFAULT 0;
