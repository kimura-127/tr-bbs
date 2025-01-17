-- トップページ用の複合インデックス（updated_at順）
CREATE INDEX idx_articles_list ON articles (updated_at DESC, id, title, user_id, replies_count);
