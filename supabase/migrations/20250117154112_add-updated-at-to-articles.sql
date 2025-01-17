-- トリガー関数の作成（既存の関数を再利用）
CREATE TRIGGER handle_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
