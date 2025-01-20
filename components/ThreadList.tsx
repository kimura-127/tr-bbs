'use client';

import { CreateThreadForm } from '@/components/CreateThreadForm';
import { type Payment, columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Bell,
  Brain,
  Menu,
  Search,
  ShoppingBasket,
  SquarePen,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  initialData: Payment[];
};

export function ThreadList({ initialData }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisibleSearch, setIsVisibleSearch] = useState(false);

  return (
    <div className="container mx-auto py-1.5">
      <div className="flex gap-1 bg-gray-700 rounded-lg px-2 h-12 items-center">
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
                <SquarePen />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen overflow-auto">
              <DialogHeader>
                <DialogTitle>新規スレッド作成</DialogTitle>
                <DialogDescription className="py-2">
                  タイトルとコメントを入力してください
                </DialogDescription>
              </DialogHeader>
              <CreateThreadForm setIsDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button
            onClick={() => setIsVisibleSearch(!isVisibleSearch)}
            className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
          >
            <Search />
            検索
          </Button>
        </div>

        {/* PC表示用のボタン */}
        <div className="hidden md:flex gap-1">
          <div>
            <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
              <Link
                className="flex justify-center items-center gap-2"
                href={'/notificationSetting'}
              >
                <Bell />
                通知設定
              </Link>
            </Button>
          </div>
          <div>
            <Button
              onClick={() =>
                toast.info('AIによる相場検索機能', {
                  description: '近日実装予定です。今しばらくお待ちください。',
                  action: {
                    label: '閉じる',
                    onClick: () => {},
                  },
                })
              }
              className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
            >
              <Brain />
              AIによる相場検索
            </Button>
          </div>
          <div>
            <Button
              onClick={() =>
                toast.info('出品通知機能', {
                  description:
                    '欲しい装備やアイテムが出品された際に通知を受け取れる機能を近日実装予定です。今しばらくお待ちください。',
                  action: {
                    label: '閉じる',
                    onClick: () => {},
                  },
                })
              }
              className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
            >
              <ShoppingBasket />
              出品装備・アイテムの通知
            </Button>
          </div>
        </div>

        {/* スマートフォン表示用のハンバーガーメニュー */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent h-fit w-12 h-12"
              >
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4">
                <div className="border-b pb-4">
                  <DialogTitle className="text-lg font-semibold">
                    メニュー
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    通知設定や機能へのアクセス
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <Link
                    href={'/notificationSetting'}
                    className="flex items-center gap-3 text-base hover:text-primary transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <div>
                      <div className="font-medium">通知設定</div>
                      <p className="text-sm text-muted-foreground">
                        通知の設定を管理します
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      toast.info('AIによる相場検索機能', {
                        description:
                          '近日実装予定です。今しばらくお待ちください。',
                        action: {
                          label: '閉じる',
                          onClick: () => {},
                        },
                      })
                    }
                    className="flex items-center justify-start gap-3 text-base h-auto px-0 hover:bg-transparent"
                  >
                    <Brain />
                    <div className="flex flex-col items-start">
                      <div className="font-medium">AIによる相場検索</div>
                      <p className="text-sm text-muted-foreground text-left">
                        AIを使って相場を検索します
                      </p>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      toast.info('出品通知機能', {
                        description:
                          '欲しい装備やアイテムが出品された際に通知を受け取れる機能を近日実装予定です。今しばらくお待ちください。',
                        action: {
                          label: '閉じる',
                          onClick: () => {},
                        },
                      })
                    }
                    className="flex items-center justify-start gap-3 text-base h-auto px-0 hover:bg-transparent"
                  >
                    <ShoppingBasket />
                    <div className="flex flex-col items-start">
                      <div className="font-medium">
                        出品装備・アイテムの通知
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        新しい出品情報を通知します
                      </p>
                    </div>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
      <DataTable
        columns={columns}
        data={initialData}
        isVisibleSearch={isVisibleSearch}
      />
    </div>
  );
}
