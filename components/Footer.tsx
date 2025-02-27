import { ThemeSwitcher } from './theme-switcher';

export function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 py-8 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-40 gap-20">
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
        <div className="mt-8 pt-4 flex items-center justify-between flex-col md:flex-row gap-6 max-md:mb-20">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2025 チョコットランド取引掲示板 - 装備売り買い・交換BBS
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm">テーマ切替:</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
