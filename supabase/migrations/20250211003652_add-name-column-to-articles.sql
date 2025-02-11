-- 取引掲示板のarticlesテーブルにnameカラムを追加
ALTER TABLE articles
ADD COLUMN name TEXT;

-- 取引掲示板のrepliesテーブルにnameカラムを追加
ALTER TABLE replies
ADD COLUMN name TEXT;

-- アバター掲示板のavatar_articlesテーブルにnameカラムを追加
ALTER TABLE avatar_articles
ADD COLUMN name TEXT;

-- アバター掲示板のavatar_repliesテーブルにnameカラムを追加
ALTER TABLE avatar_replies
ADD COLUMN name TEXT;

-- 雑談掲示板のfree_talk_articlesテーブルにnameカラムを追加
ALTER TABLE free_talk_articles
ADD COLUMN name TEXT;

-- 雑談掲示板のfree_talk_repliesテーブルにnameカラムを追加
ALTER TABLE free_talk_replies
ADD COLUMN name TEXT;