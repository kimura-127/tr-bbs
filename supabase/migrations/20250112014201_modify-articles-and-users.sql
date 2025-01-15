-- articlesテーブルのuser_id制約を変更（NOT NULL制約を削除）
ALTER TABLE articles 
ALTER COLUMN user_id DROP NOT NULL;

-- app_usersテーブルにisBan列を追加
ALTER TABLE app_users
ADD COLUMN is_ban boolean NOT NULL DEFAULT false;

-- RLSポリシーの更新（user_idのチェックを任意に）
DROP POLICY IF EXISTS "Users can create their own articles" ON articles;
CREATE POLICY "Anyone can create articles with optional user_id"
    ON articles FOR INSERT
    WITH CHECK (
        user_id IS NULL OR  -- user_idがnullの場合は許可
        auth.uid() = user_id -- または自分のuser_idの場合も許可
    );