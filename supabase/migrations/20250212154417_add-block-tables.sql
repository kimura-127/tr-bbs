-- set_updated_at関数の作成
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ブロックテーブルの作成
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_user_id TEXT NOT NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('warning', 'block')),
  reason TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLSの有効化
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY "Enable insert for everyone" ON public.blocks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for everyone" ON public.blocks
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for everyone" ON public.blocks
  FOR DELETE USING (true);

CREATE POLICY "Enable select for everyone" ON public.blocks
  FOR SELECT USING (true);

-- updated_atを自動更新するトリガーの作成
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
