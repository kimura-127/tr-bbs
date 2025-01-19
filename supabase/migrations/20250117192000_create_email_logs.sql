-- メール送信履歴テーブルの作成
CREATE TABLE email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notification_setting_id UUID NOT NULL REFERENCES notification_settings(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  reply_id UUID NOT NULL REFERENCES replies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- インデックスの作成
CREATE INDEX idx_email_logs_notification_setting_id ON email_logs(notification_setting_id);
CREATE INDEX idx_email_logs_thread_id ON email_logs(thread_id);
CREATE INDEX idx_email_logs_reply_id ON email_logs(reply_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);

-- 更新日時を自動更新するトリガー
CREATE TRIGGER update_email_logs_updated_at
  BEFORE UPDATE ON email_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at(); 