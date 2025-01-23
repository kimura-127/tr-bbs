-- 雑談用テーブル
CREATE TABLE IF NOT EXISTS free_talk_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    replies_count INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS free_talk_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    article_id UUID REFERENCES free_talk_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_urls TEXT[] DEFAULT '{}'::TEXT[]
);

-- アバター取引用テーブル
CREATE TABLE IF NOT EXISTS avatar_articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    replies_count INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS avatar_replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    article_id UUID REFERENCES avatar_articles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    image_urls TEXT[] DEFAULT '{}'::TEXT[]
);

-- トリガー関数の作成（雑談用）
CREATE OR REPLACE FUNCTION update_free_talk_articles_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE free_talk_articles
        SET replies_count = replies_count + 1
        WHERE id = NEW.article_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE free_talk_articles
        SET replies_count = replies_count - 1
        WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成（雑談用）
CREATE TRIGGER update_free_talk_articles_replies_count_trigger
AFTER INSERT OR DELETE ON free_talk_replies
FOR EACH ROW
EXECUTE FUNCTION update_free_talk_articles_replies_count();

-- トリガー関数の作成（アバター取引用）
CREATE OR REPLACE FUNCTION update_avatar_articles_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE avatar_articles
        SET replies_count = replies_count + 1
        WHERE id = NEW.article_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE avatar_articles
        SET replies_count = replies_count - 1
        WHERE id = OLD.article_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成（アバター取引用）
CREATE TRIGGER update_avatar_articles_replies_count_trigger
AFTER INSERT OR DELETE ON avatar_replies
FOR EACH ROW
EXECUTE FUNCTION update_avatar_articles_replies_count();

-- RLSポリシーの設定（雑談用）
ALTER TABLE free_talk_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE free_talk_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles" ON free_talk_articles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert articles" ON free_talk_articles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own articles" ON free_talk_articles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON free_talk_articles
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view replies" ON free_talk_replies
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert replies" ON free_talk_replies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own replies" ON free_talk_replies
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM free_talk_articles WHERE id = article_id
    ));

CREATE POLICY "Users can delete their own replies" ON free_talk_replies
    FOR DELETE USING (auth.uid() IN (
        SELECT user_id FROM free_talk_articles WHERE id = article_id
    ));

-- RLSポリシーの設定（アバター取引用）
ALTER TABLE avatar_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatar_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles" ON avatar_articles
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert articles" ON avatar_articles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own articles" ON avatar_articles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON avatar_articles
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view replies" ON avatar_replies
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert replies" ON avatar_replies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own replies" ON avatar_replies
    FOR UPDATE USING (auth.uid() IN (
        SELECT user_id FROM avatar_articles WHERE id = article_id
    ));

CREATE POLICY "Users can delete their own replies" ON avatar_replies
    FOR DELETE USING (auth.uid() IN (
        SELECT user_id FROM avatar_articles WHERE id = article_id
    ));
