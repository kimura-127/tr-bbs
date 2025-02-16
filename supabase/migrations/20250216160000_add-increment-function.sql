-- 閲覧数をインクリメントする関数を作成
CREATE OR REPLACE FUNCTION increment_views_count(table_name text, record_id uuid)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    UPDATE %I 
    SET views_count = views_count + 1 
    WHERE id = %L', 
    table_name, 
    record_id
  );
END;
$$ LANGUAGE plpgsql;