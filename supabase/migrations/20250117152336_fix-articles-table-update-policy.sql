-- 既存のUPDATEポリシーを削除
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Anyone can update articles" ON articles;

-- 新しいUPDATEポリシーを作成（誰でも更新可能）
CREATE POLICY "Anyone can update articles" ON articles
    FOR UPDATE USING (true)
    WITH CHECK (true);