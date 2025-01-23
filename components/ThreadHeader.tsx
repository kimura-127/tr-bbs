'use client';

export function ThreadHeader({ title }: { title: string }) {
  return (
    <div>
      <div className="flex gap-1 bg-gray-700 rounded-lg px-8 h-12 items-center">
        <p className="text-white font-bold tracking-widest text-lg leading-9">
          {title}
        </p>
      </div>
      <div className="my-4 ml-4 text-xs border rounded-lg p-4 text-muted-foreground">
        <h1 className="sr-only">チョコットランド 取引掲示板</h1>
        <p className="leading-4 tracking-wide">
          チョコットランド（チョコラン）の取引掲示板（BBS）へようこそ。
          アイテムの売買や交換の取引ができる避難所として、安全な取引の場を提供しています。
        </p>
        <p className="mt-2 leading-4 tracking-wide">
          スレッドの作成、コメントの投稿、通知機能を使って快適に取引を行えます。
          近日中にはAIによる相場検索機能も実装予定です。
        </p>
      </div>
    </div>
  );
}
