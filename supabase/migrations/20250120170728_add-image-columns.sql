-- articlesテーブルに画像関連のカラムを追加
ALTER TABLE articles
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- repliesテーブルに画像関連のカラムを追加（将来的な拡張のため）
ALTER TABLE replies
ADD COLUMN image_urls TEXT[] DEFAULT '{}';

-- ストレージバケットの作成
INSERT INTO storage.buckets (id, name, public)
VALUES ('thread_images', 'thread_images', true);

-- ストレージのセキュリティポリシー設定
-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Public Access thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete thread_images" ON storage.objects;

-- SELECT: 誰でも
CREATE POLICY "Public Access thread_images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'thread_images');

-- INSERT: 誰でも
CREATE POLICY "Public Insert thread_images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'thread_images');

-- UPDATE: 誰でも
CREATE POLICY "Public Update thread_images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'thread_images')
WITH CHECK (bucket_id = 'thread_images');

-- DELETE: 本人のみ
CREATE POLICY "Owner Delete thread_images"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'thread_images' 
  AND (auth.uid() = owner)
);

-- RLSポリシーの有効化
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
