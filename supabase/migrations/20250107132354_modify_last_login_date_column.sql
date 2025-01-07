-- last_login_dateカラムの型を変更
alter table app_users
alter column last_login_date type date;

-- NOT NULL制約を追加
alter table app_users
alter column last_login_date set not null;