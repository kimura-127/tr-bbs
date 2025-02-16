-- 既存のトリガーを確認
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    FOR trigger_record IN
        SELECT tgname, relname
        FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        WHERE c.relname IN ('articles', 'avatar_articles', 'free_talk_articles')
    LOOP
        RAISE NOTICE 'Found trigger % on table %', trigger_record.tgname, trigger_record.relname;
    END LOOP;
END $$;

-- articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS handle_articles_updated_at ON articles;
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;

-- avatar_articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS update_avatar_articles_updated_at ON avatar_articles;

-- free_talk_articlesテーブルのトリガーを削除
DROP TRIGGER IF EXISTS update_free_talk_articles_updated_at ON free_talk_articles;

-- トリガー関数も削除（必要な場合のみ）
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_articles_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
