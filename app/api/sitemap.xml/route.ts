import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();

  // スレッドの一覧を取得
  const { data: threads } = await supabase
    .from('articles')
    .select('id, updated_at')
    .order('created_at', { ascending: false });

  // 基本的なURLエントリー
  const staticUrls = [
    {
      loc: 'https://www.cl-bbs.com/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0',
    },
    {
      loc: 'https://www.cl-bbs.com/thread/new',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8',
    },
    {
      loc: 'https://www.cl-bbs.com/notificationSetting',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.5',
    },
  ];

  // スレッド詳細ページのURLエントリーを生成
  const threadUrls =
    threads?.map((thread) => ({
      loc: `https://www.cl-bbs.com/thread/${thread.id}`,
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

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
