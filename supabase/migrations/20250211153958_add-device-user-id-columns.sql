ALTER TABLE articles ADD COLUMN device_user_id TEXT;
ALTER TABLE replies ADD COLUMN device_user_id TEXT;
ALTER TABLE avatar_articles ADD COLUMN device_user_id TEXT;
ALTER TABLE avatar_replies ADD COLUMN device_user_id TEXT;
ALTER TABLE free_talk_articles ADD COLUMN device_user_id TEXT;
ALTER TABLE free_talk_replies ADD COLUMN device_user_id TEXT;
