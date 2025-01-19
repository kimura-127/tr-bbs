-- 通知設定テーブルの作成
CREATE TABLE notification_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  email VARCHAR(255),
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_notification_settings_thread_id ON notification_settings(thread_id);
CREATE INDEX idx_notification_settings_email ON notification_settings(email);

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 