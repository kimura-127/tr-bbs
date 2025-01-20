import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';
import { SiteLogo } from '@/components/SiteLogo';
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
    default: 'チョコットランド 取引掲示板 | 装備売り買い・交換BBS',
    template: '%s | チョコットランド取引掲示板',
  },
  description:
    'チョコットランドの取引掲示板（BBS）です。アイテムの売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。チョコラン公認の避難所として、安全な取引の場を提供しています。',
  keywords: [
    'チョコットランド',
    '掲示板',
    'BBS',
    '取引',
    '避難所',
    '装備売買',
    'ボート',
    'チョコラン',
    'ゲーム取引',
    'アイテムトレード',
  ],
  authors: [{ name: 'チョコットランド取引掲示板' }],
  openGraph: {
    title: 'チョコットランド 取引掲示板 | アイテム売買・交換BBS',
    description:
      'チョコットランドの取引掲示板（BBS）です。アイテムの売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。チョコラン公認の避難所として、安全な取引の場を提供しています。',
    url: defaultUrl,
    siteName: 'チョコットランド取引掲示板',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'チョコットランド 取引掲示板 | 装備売り買い・交換BBS',
    description:
      'チョコットランドの取引掲示板（BBS）です。アイテムの売買や交換の取引ができます。スレッドの作成、コメントの投稿、通知機能で快適な取引環境を提供します。',
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
          <SiteLogo />
          <main className="min-h-screen flex flex-col items-center">
            {children}
          </main>
          <footer className="w-full bg-gray-800 text-gray-300 py-8 mt-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-40">
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    チョコットランド取引掲示板（チョコランBBS）について
                  </h2>
                  <p className="text-sm">
                    当サイトはチョコットランド（チョコラン）のアイテム取引をサポートする掲示板（BBS）です。
                    装備やアイテムの売買・交換を安全に行える環境を提供しています。
                  </p>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-4">主な機能</h2>
                  <ul className="text-sm space-y-2">
                    <li>・スレッド作成機能</li>
                    <li>・メール通知機能</li>
                    <li>・LINE通知機能（開発中）</li>
                    <li>・AIによる相場検索（開発中）</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm">
                <p>© 2025 チョコットランド取引掲示板 - 装備売り買い・交換BBS</p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
