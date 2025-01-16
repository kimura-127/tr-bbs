-- トリガーの削除
DROP TRIGGER IF EXISTS update_article_replies_count_trigger ON replies;

-- トリガー関数の削除
DROP FUNCTION IF EXISTS update_article_replies_count();