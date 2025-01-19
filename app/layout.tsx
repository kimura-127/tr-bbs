import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';
import { SiteLogo } from '@/components/SiteLogo';
import type { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: '掲示板アプリ',
    template: '%s | 掲示板アプリ',
  },
  description:
    '掲示板アプリです。スレッドの作成、コメントの投稿、通知機能などが利用できます。',
  keywords: ['掲示板', 'コミュニティ', 'スレッド', 'コメント', '通知'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: '掲示板アプリ',
    description:
      '掲示板アプリです。スレッドの作成、コメントの投稿、通知機能などが利用できます。',
    url: defaultUrl,
    siteName: '掲示板アプリ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '掲示板アプリ',
    description:
      '掲示板アプリです。スレッドの作成、コメントの投稿、通知機能などが利用できます。',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'IbtO0bo_HX6HlYbCYsZLSvrCouw09paR-la4e910bJk"',
  },
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={geistSans.className} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteLogo />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
