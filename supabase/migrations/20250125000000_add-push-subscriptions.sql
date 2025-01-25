-- push_subscriptionsテーブルの作成
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    thread_id UUID REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    endpoint TEXT NOT NULL,
    auth TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_push_subscriptions_thread_id ON push_subscriptions(thread_id);
CREATE INDEX idx_push_subscriptions_expires_at ON push_subscriptions(expires_at);

-- 更新日時を自動更新するトリガーを設定
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- RLSを有効化
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの設定
-- SELECT: 誰でも閲覧可能
CREATE POLICY "Anyone can view push_subscriptions"
    ON push_subscriptions FOR SELECT
    USING (true);

-- INSERT: 誰でも登録可能
CREATE POLICY "Anyone can create push_subscriptions"
    ON push_subscriptions FOR INSERT
    WITH CHECK (true);

-- UPDATE: 誰でも更新可能
CREATE POLICY "Anyone can update push_subscriptions"
    ON push_subscriptions FOR UPDATE
    USING (true);

-- DELETE: 誰でも削除可能
CREATE POLICY "Anyone can delete push_subscriptions"
    ON push_subscriptions FOR DELETE
    USING (true);

-- 期限切れの購読情報を自動削除する関数
CREATE OR REPLACE FUNCTION cleanup_expired_push_subscriptions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM push_subscriptions
    WHERE expires_at < NOW();
END;
$$; 