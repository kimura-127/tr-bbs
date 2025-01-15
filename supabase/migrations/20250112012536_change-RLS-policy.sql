-- app_usersテーブルのポリシー修正
-- INSERTポリシー: 誰でも新規ユーザー登録可能
create policy "Enable insert for anyone"
    on app_users for insert
    with check (true);

-- DELETEポリシー: 自分自身のプロフィールのみ削除可能
create policy "Users can delete their own profile"
    on app_users for delete
    using (auth.uid() = id);

-- articlesテーブルのINSERTポリシー修正
-- 既存のポリシーを削除
drop policy if exists "Users can create their own articles" on articles;

-- 新しいポリシーを作成
create policy "Anyone can create articles"
    on articles for insert
    with check (true);

-- repliesテーブルのINSERTポリシー修正
-- 既存のポリシーを削除
drop policy if exists "Authenticated users can create replies" on replies;

-- 新しいポリシーを作成
create policy "Anyone can create replies"
    on replies for insert
    with check (true);