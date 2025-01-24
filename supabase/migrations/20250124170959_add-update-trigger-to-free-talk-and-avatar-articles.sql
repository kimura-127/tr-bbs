-- free_talk_articlesテーブルにトリガーを追加
CREATE TRIGGER update_free_talk_articles_updated_at
    BEFORE UPDATE ON free_talk_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- avatar_articlesテーブルにトリガーを追加
CREATE TRIGGER update_avatar_articles_updated_at
    BEFORE UPDATE ON avatar_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
