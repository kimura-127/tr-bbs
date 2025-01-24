-- 既存のインデックスを削除（念のため）
DROP INDEX IF EXISTS idx_free_talk_articles_list;
DROP INDEX IF EXISTS idx_avatar_articles_list;

-- free_talk_articlesテーブルにインデックスを作成
CREATE INDEX idx_free_talk_articles_list ON free_talk_articles (updated_at DESC, id, title, user_id, replies_count);

-- avatar_articlesテーブルにインデックスを作成
CREATE INDEX idx_avatar_articles_list ON avatar_articles (updated_at DESC, id, title, user_id, replies_count);
