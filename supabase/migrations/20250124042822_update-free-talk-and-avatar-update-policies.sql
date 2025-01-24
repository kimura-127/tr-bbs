-- 既存のUPDATEポリシーを削除
DROP POLICY IF EXISTS "Users can update their own articles" ON free_talk_articles;
DROP POLICY IF EXISTS "Users can update their own replies" ON free_talk_replies;
DROP POLICY IF EXISTS "Users can update their own articles" ON avatar_articles;
DROP POLICY IF EXISTS "Users can update their own replies" ON avatar_replies;

-- 新しいUPDATEポリシーを作成（誰でも更新可能）
CREATE POLICY "Anyone can update articles" ON free_talk_articles
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can update replies" ON free_talk_replies
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can update articles" ON avatar_articles
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can update replies" ON avatar_replies
    FOR UPDATE USING (true);
