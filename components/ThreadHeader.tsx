'use client';

import { useToast } from '@/hooks/use-toast';
import { RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { HyperText } from './ui/hyper-text';

export function ThreadHeader({ title }: { title: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      router.refresh();
      toast({
        description: '記事一覧を更新しました',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '更新中にエラーが発生しました',
      });
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 100);
    }
  };

  return (
    <div>
      <div className="flex gap-1 bg-gray-700 rounded-lg px-8 h-12 items-center justify-between">
        <HyperText
          className="text-lg font-bold text-white tracking-widest leading-9"
          text={title}
        />
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="md:hidden bg-gray-700 hover:bg-transparent font-bold text-base"
        >
          <RotateCw className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? '更新中...' : '更新'}
        </Button>
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
