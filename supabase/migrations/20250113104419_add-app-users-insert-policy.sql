-- RLSを有効化
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- 誰でも新規ユーザーを作成できるポリシーを追加
CREATE POLICY "Enable insert for all users" ON public.app_users
    FOR INSERT 
    WITH CHECK (true);

-- 自分自身のデータのみ参照・更新できるポリシーを追加
CREATE POLICY "Enable read own data" ON public.app_users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Enable update own data" ON public.app_users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);