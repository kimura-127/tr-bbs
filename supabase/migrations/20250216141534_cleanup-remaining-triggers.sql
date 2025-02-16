-- articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS handle_articles_updated_at ON articles;

-- free_talk_articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS update_free_talk_articles_updated_at ON free_talk_articles;

-- avatar_articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS update_avatar_articles_updated_at ON avatar_articles;

-- トリガー関数も削除
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
