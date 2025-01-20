-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Public Access thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Owner Delete thread_images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload thread_images" ON storage.objects;

-- SELECT: 誰でも
CREATE POLICY "Anyone can select thread_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'thread_images');

-- INSERT: 誰でも
CREATE POLICY "Anyone can insert thread_images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thread_images');

-- UPDATE: 誰でも
CREATE POLICY "Anyone can update thread_images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'thread_images')
WITH CHECK (bucket_id = 'thread_images');

-- DELETE: 本人のみ
CREATE POLICY "Only owner can delete thread_images"
ON storage.objects FOR DELETE
USING (bucket_id = 'thread_images' AND auth.uid() = owner);

-- バケットが存在しない場合は作成
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM storage.buckets
        WHERE id = 'thread_images'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('thread_images', 'thread_images', true);
    END IF;
END $$;
