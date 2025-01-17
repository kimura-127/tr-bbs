-- articlesテーブルにupdated_atカラムを追加
ALTER TABLE articles
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 既存のインデックスを削除
DROP INDEX IF EXISTS idx_articles_list;

-- 新しいインデックスを作成（updated_at順）
CREATE INDEX idx_articles_list ON articles (updated_at DESC, id, title, user_id, replies_count);

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_articles_updated_at();
