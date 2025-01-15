-- まず既存のすべてのポリシーを削除
DROP POLICY IF EXISTS "Enable insert for all users" ON public.app_users;
DROP POLICY IF EXISTS "Enable read own data" ON public.app_users;
DROP POLICY IF EXISTS "Enable update own data" ON public.app_users;
DROP POLICY IF EXISTS "Enable all operations for all users" ON public.app_users;

-- RLSを一旦無効化
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;

-- 現在のポリシーを確認するためのクエリ
SELECT *
FROM pg_policies
WHERE tablename = 'app_users';

-- 新しいポリシーを設定
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 開発用の簡単なポリシー（すべての操作を許可）
CREATE POLICY "Enable all operations for development" ON public.app_users
    FOR ALL
    USING (true)
    WITH CHECK (true);