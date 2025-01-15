-- すべての既存ポリシーを削除
DROP POLICY IF EXISTS "Users can view their own profile" ON app_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON app_users;
DROP POLICY IF EXISTS "Enable insert for anyone" ON app_users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON app_users;
DROP POLICY IF EXISTS "Enable insert for all users" ON app_users;
DROP POLICY IF EXISTS "Enable read own data" ON app_users;
DROP POLICY IF EXISTS "Enable update own data" ON app_users;
DROP POLICY IF EXISTS "Enable all operations for development" ON app_users;

DROP POLICY IF EXISTS "Anyone can view articles" ON articles;
DROP POLICY IF EXISTS "Users can create their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;
DROP POLICY IF EXISTS "Anyone can create articles" ON articles;
DROP POLICY IF EXISTS "Anyone can create articles with optional user_id" ON articles;

DROP POLICY IF EXISTS "Anyone can view replies" ON replies;
DROP POLICY IF EXISTS "Authenticated users can create replies" ON replies;
DROP POLICY IF EXISTS "Users can update their own replies" ON replies;
DROP POLICY IF EXISTS "Users can delete their own replies" ON replies;
DROP POLICY IF EXISTS "Anyone can create replies" ON replies;

-- RLSを有効化
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

-- app_usersテーブルの新しいポリシー
CREATE POLICY "Anyone can view users" ON app_users
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON app_users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON app_users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON app_users
    FOR DELETE USING (auth.uid() = id);

-- articlesテーブルの新しいポリシー
CREATE POLICY "Anyone can view articles" ON articles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert articles" ON articles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own articles" ON articles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON articles
    FOR DELETE USING (auth.uid() = user_id);

-- repliesテーブルの新しいポリシー
CREATE POLICY "Anyone can view replies" ON replies
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert replies" ON replies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own replies" ON replies
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM articles WHERE id = article_id
    ));

CREATE POLICY "Users can delete their own replies" ON replies
    FOR DELETE USING (auth.uid() IN (
        SELECT user_id FROM articles WHERE id = article_id
    ));