import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata, Viewport } from 'next';

const defaultUrl = 'https://www.cl-bbs.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: 'チョコットランド 総合掲示板 | 装備取引・雑談・アバター取引',
    template: '%s | チョコットランド総合掲示板',
  },
  description:
    'チョコットランドの総合掲示板（BBS）です。装備取引・雑談・アバター取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。総合掲示板として安全な取引の場を提供しています。',
  keywords: [
    'チョコットランド',
    'チョコラン',
    '総合掲示板',
    '掲示板',
    '取引',
    '避難所',
    '装備売買',
    'BBS',
    'bbs',
    '装備',
    'アバター',
  ],
  authors: [{ name: 'チョコットランド総合掲示板' }],
  openGraph: {
    title: 'チョコットランド 総合掲示板 | 装備取引・雑談・アバター取引',
    description:
      'チョコットランドの総合掲示板（BBS）です。装備取引・雑談・アバター取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。総合掲示板として安全な取引の場を提供しています。',
    url: defaultUrl,
    siteName: 'チョコットランド取引掲示板',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'チョコットランド総合掲示板',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'チョコットランド 総合掲示板 | 装備取引・雑談・アバター取引',
    description:
      'チョコットランドの総合掲示板（BBS）です。装備取引・雑談・アバター取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'IbtO0bo_HX6HlYbCYsZLSvrCouw09paR-la4e910bJk',
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
          <Header />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
