import { createClient as createServerClient } from '@supabase/supabase-js';
import type { GetServerSideProps } from 'next';
import type { FC } from 'react';

// Supabaseクライアントの作成（Pages Router用）
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// 空のコンポーネント（サイトマップはgetServerSidePropsで生成するため）
const Sitemap: FC = () => null;

export default Sitemap;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // スレッドの一覧を取得
  const { data: threads } = await supabase
    .from('articles')
    .select('id, updated_at')
    .order('created_at', { ascending: false });

  // 基本的なURLエントリー
  const staticUrls = [
    {
      loc: `${process.env.VERCEL_URL}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0',
    },
    // TODO: 未実装のためコメントアウトとする
    // {
    //   loc: `${domain}/notificationSetting`,
    //   lastmod: new Date().toISOString().split('T')[0],
    //   changefreq: 'weekly',
    //   priority: '0.8',
    // },
  ];

  // スレッド詳細ページのURLエントリーを生成
  const threadUrls =
    threads?.map((thread) => ({
      loc: `${process.env.VERCEL_URL}/thread/${thread.id}`,
      lastmod: thread.updated_at.split('T')[0],
      changefreq: 'daily',
      priority: '0.7',
    })) || [];

  // XMLの生成
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...staticUrls, ...threadUrls]
        .map(
          (url) => `
        <url>
          <loc>${url.loc}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `
        )
        .join('')}
    </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
