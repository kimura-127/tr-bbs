'use client';

import { SiteLogo } from '@/components/SiteLogo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { DialogTitle } from './ui/dialog';

// メニュー項目の定義
const MENU_ITEMS = {
  boards: {
    title: '掲示板一覧',
    items: [
      {
        href: '/',
        title: '取引掲示板',
        description: 'アイテムや装備の売買・交換ができる掲示板です',
      },
      {
        href: '/free-talk',
        title: '雑談掲示板',
        description: 'チョコットランドに関する雑談ができる掲示板です',
      },
      {
        href: '/avatar',
        title: 'アバター掲示板',
        description: 'アバターの売買・交換ができる掲示板です',
      },
    ],
  },
  notifications: {
    title: '通知',
    items: [
      {
        href: '/notificationSetting',
        title: '通知設定',
        description: 'メールやLINEでの通知設定ができます',
      },
      {
        href: '/item-notification',
        title: '出品装備を通知',
        description: '欲しい装備が出品された際に通知を受け取れます',
      },
    ],
  },
  aiSearch: {
    href: '/ai-search',
    title: 'AIによる相場検索',
  },
};

export function Header() {
  return (
    <div className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 shadow-sm backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4">
        <SiteLogo />

        {/* モバイル用メニュー */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger className="p-2">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-sm scrollbar-hide overflow-y-auto"
            >
              <nav className="flex flex-col gap-4">
                {/* 掲示板一覧 */}
                <DialogTitle className="text-gray-800">掲示板一覧</DialogTitle>
                {MENU_ITEMS.boards.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block p-4 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <SheetClose className="flex flex-col">
                      <div className="font-bold text-gray-800 mb-1">
                        {item.title}
                      </div>

                      <p className="text-sm text-gray-600 text-left">
                        {item.description}
                      </p>
                    </SheetClose>
                  </Link>
                ))}
                <div className="border-t my-2" />
                {/* 通知関連 */}
                <DialogTitle className="text-gray-800">通知</DialogTitle>
                {MENU_ITEMS.notifications.items.map((item, index) => {
                  if (index === 1) {
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                      <div
                        key={item.href}
                        className="block p-4 rounded-lg hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                        onClick={() => {
                          toast.info('通知機能', {
                            description:
                              '近日実装予定です。今しばらくお待ちください。',
                          });
                        }}
                      >
                        <div className="font-bold text-gray-800 mb-1">
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block p-4 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                    >
                      <SheetClose className="flex flex-col">
                        <div className="font-bold text-gray-800 mb-1">
                          {item.title}
                        </div>
                        <p className="text-sm text-gray-600 text-left">
                          {item.description}
                        </p>
                      </SheetClose>
                    </Link>
                  );
                })}
                <div className="border-t my-2" />
                {/* AI検索 */}
                {/* <Link
                  href={MENU_ITEMS.aiSearch.href}
                  className="block p-4 rounded-lg hover:bg-gray-50/80 transition-all duration-200"
                > */}
                <Button
                  className="bg-white/80 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
                  disabled
                >
                  <div className="font-bold text-gray-800">
                    {MENU_ITEMS.aiSearch.title}
                  </div>
                </Button>
                {/* </Link> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* デスクトップ用メニュー */}
        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              {/* 掲示板一覧 */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white/80 text-gray-700 hover:text-gray-900 font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
                  {MENU_ITEMS.boards.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 bg-white/95 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
                    {MENU_ITEMS.boards.items.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gray-50/80 hover:shadow-sm"
                          >
                            <div className="text-sm font-bold tracking-wide text-gray-800">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* 通知 */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-white/80 text-gray-700 hover:text-gray-900 font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200">
                  {MENU_ITEMS.notifications.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 bg-white/95 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
                    {MENU_ITEMS.notifications.items.map((item, index) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          {index === 1 ? (
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
                              className="block select-none text-left bg-white space-y-1 rounded w-full h-full p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gray-50/80 hover:shadow-sm"
                            >
                              <div className="text-sm font-bold tracking-wide text-gray-800">
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </Button>
                          ) : (
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-gray-50/80 hover:shadow-sm"
                            >
                              <div className="text-sm font-bold tracking-wide text-gray-800">
                                {item.title}
                              </div>
                              <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </Link>
                          )}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* AIによる相場検索 */}
              <NavigationMenuItem>
                {/* <Link href={MENU_ITEMS.aiSearch.href} legacyBehavior passHref>
                  <NavigationMenuLink className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white/80 text-gray-700 hover:text-gray-900 h-10 px-4 py-2 tracking-wide shadow-sm hover:shadow-md"> */}
                <Button
                  className="bg-white/80 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 font-bold tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
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
                >
                  {MENU_ITEMS.aiSearch.title}
                </Button>
                {/* </NavigationMenuLink>
                </Link> */}
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </div>
  );
}
