-- 取引掲示板テーブルのパスワードカラムを数値型に変更
ALTER TABLE public.articles
ALTER COLUMN password DROP DEFAULT;

ALTER TABLE public.articles
ALTER COLUMN password TYPE INTEGER USING (
  CASE 
    WHEN password IS NULL THEN NULL 
    ELSE password::INTEGER 
  END
);

ALTER TABLE public.articles
ALTER COLUMN password SET DEFAULT NULL;

-- 雑談掲示板テーブルのパスワードカラムを数値型に変更
ALTER TABLE public.free_talk_articles
ALTER COLUMN password DROP DEFAULT;

ALTER TABLE public.free_talk_articles
ALTER COLUMN password TYPE INTEGER USING (
  CASE 
    WHEN password IS NULL THEN NULL 
    ELSE password::INTEGER 
  END
);

ALTER TABLE public.free_talk_articles
ALTER COLUMN password SET DEFAULT NULL;

-- アバター掲示板テーブルのパスワードカラムを数値型に変更
ALTER TABLE public.avatar_articles
ALTER COLUMN password DROP DEFAULT;

ALTER TABLE public.avatar_articles
ALTER COLUMN password TYPE INTEGER USING (
  CASE 
    WHEN password IS NULL THEN NULL 
    ELSE password::INTEGER 
  END
);

ALTER TABLE public.avatar_articles
ALTER COLUMN password SET DEFAULT NULL;

-- パスワードカラムの説明（コメント）を更新
COMMENT ON COLUMN public.articles.password IS '4桁の数値パスワード（記事の編集・削除時に使用）';
COMMENT ON COLUMN public.free_talk_articles.password IS '4桁の数値パスワード（記事の編集・削除時に使用）';
COMMENT ON COLUMN public.avatar_articles.password IS '4桁の数値パスワード（記事の編集・削除時に使用）';
