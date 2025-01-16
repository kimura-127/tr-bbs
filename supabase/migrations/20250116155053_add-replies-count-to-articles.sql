ALTER TABLE articles ADD COLUMN replies_count INTEGER NOT NULL DEFAULT 0;

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION update_article_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE articles
    SET replies_count = replies_count + 1
    WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE articles
    SET replies_count = replies_count - 1
    WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER update_article_replies_count_trigger
AFTER INSERT OR DELETE ON replies
FOR EACH ROW
EXECUTE FUNCTION update_article_replies_count();
