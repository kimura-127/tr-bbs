-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create app_users table
create table if not exists app_users (
    id uuid default uuid_generate_v4() primary key,
    email text unique not null,
    name text not null,
    last_login_date timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    auth_provider text
);

-- Create articles table
create table if not exists articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references app_users(id) on delete cascade not null
);

-- Create replies table
create table if not exists replies (
    id uuid default uuid_generate_v4() primary key,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    article_id uuid references articles(id) on delete cascade not null
);

-- Enable Row Level Security
alter table app_users enable row level security;
alter table articles enable row level security;
alter table replies enable row level security;

-- Create update trigger for updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Add trigger to app_users table
create trigger handle_updated_at
    before update on app_users
    for each row
    execute function handle_updated_at();

-- Create indexes for better performance
create index articles_user_id_idx on articles(user_id);
create index replies_article_id_idx on replies(article_id);
create index app_users_email_idx on app_users(email);

-- Set up RLS policies
-- App Users policies
create policy "Users can view their own profile"
    on app_users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on app_users for update
    using (auth.uid() = id);

-- Articles policies
create policy "Anyone can view articles"
    on articles for select
    using (true);

create policy "Users can create their own articles"
    on articles for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own articles"
    on articles for update
    using (auth.uid() = user_id);

create policy "Users can delete their own articles"
    on articles for delete
    using (auth.uid() = user_id);

-- Replies policies
create policy "Anyone can view replies"
    on replies for select
    using (true);

create policy "Authenticated users can create replies"
    on replies for insert
    with check (auth.uid() in (select id from app_users));

create policy "Users can update their own replies"
    on replies for update
    using (auth.uid() in (select user_id from articles where id = article_id));

create policy "Users can delete their own replies"
    on replies for delete
    using (auth.uid() in (select user_id from articles where id = article_id));