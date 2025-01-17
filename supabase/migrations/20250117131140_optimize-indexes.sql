-- 既存のインデックスを削除
DROP INDEX IF EXISTS articles_user_id_idx;
DROP INDEX IF EXISTS replies_article_id_idx;
DROP INDEX IF EXISTS app_users_email_idx;

-- トップページ用の複合インデックス
-- created_atでソートし、id, title, user_id, replies_countを含む
CREATE INDEX idx_articles_list ON articles (created_at DESC, id, title, user_id, replies_count);

-- 記事詳細ページ用のインデックス
-- articlesテーブルの主キーは既にインデックスされているため、追加は不要

-- repliesテーブルの複合インデックス
-- article_idで検索し、created_at, content, idを含む
CREATE INDEX idx_replies_article_details ON replies (article_id, created_at DESC, id, content);
