-- 取引掲示板テーブルにパスワードカラムを追加
ALTER TABLE public.articles
ADD COLUMN password VARCHAR(4) DEFAULT NULL;

-- 雑談掲示板テーブルにパスワードカラムを追加
ALTER TABLE public.free_talk_articles
ADD COLUMN password VARCHAR(4) DEFAULT NULL;

-- アバター掲示板テーブルにパスワードカラムを追加
ALTER TABLE public.avatar_articles
ADD COLUMN password VARCHAR(4) DEFAULT NULL;

-- パスワードカラムの説明（コメント）を追加
COMMENT ON COLUMN public.articles.password IS '4桁のパスワード（記事の編集・削除時に使用）';
COMMENT ON COLUMN public.free_talk_articles.password IS '4桁のパスワード（記事の編集・削除時に使用）';
COMMENT ON COLUMN public.avatar_articles.password IS '4桁のパスワード（記事の編集・削除時に使用）';
