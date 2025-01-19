-- thread_idとemailの組み合わせに対する一意制約を追加
ALTER TABLE notification_settings
ADD CONSTRAINT unique_thread_email_notification 
UNIQUE (thread_id, email, type);
