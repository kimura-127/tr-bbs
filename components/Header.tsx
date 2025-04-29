'use client';

import { SiteLogo } from '@/components/SiteLogo';
import {
  Bell,
  MessageCircle,
  Search,
  ShoppingCart,
  Speech,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MenuBar } from './ui/glow-menu';

const MENU_ITEMS = [
  {
    icon: ShoppingCart,
    label: '取引掲示板',
    href: '/',
    gradient:
      'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)',
    iconColor: 'text-blue-500',
  },
  {
    icon: Speech,
    label: '雑談掲示板',
    href: '/free-talk',
    gradient:
      'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)',
    iconColor: 'text-orange-500',
  },
  {
    icon: MessageCircle,
    label: 'アバター掲示板',
    href: '/avatar',
    gradient:
      'radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)',
    iconColor: 'text-green-500',
  },
  {
    icon: Bell,
    label: '通知設定',
    href: '/notificationSetting',
    gradient:
      'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)',
    iconColor: 'text-red-500',
  },
  // {
  //   icon: Search,
  //   label: 'AIによる相場検索',
  //   href: '/ai-search',
  //   gradient:
  //     'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.06) 50%, rgba(88,28,135,0) 100%)',
  //   iconColor: 'text-purple-500',
  // },
  // {
  //   icon: Settings,
  //   label: '設定',
  //   href: '/settings',
  //   gradient:
  //     'radial-gradient(circle, rgba(20,184,166,0.15) 0%, rgba(13,148,136,0.06) 50%, rgba(15,118,110,0) 100%)',
  //   iconColor: 'text-teal-500',
  // },
  // {
  //   icon: HelpCircle,
  //   label: 'ヘルプ',
  //   href: '/help',
  //   gradient:
  //     'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.06) 50%, rgba(217,119,6,0) 100%)',
  //   iconColor: 'text-amber-500',
  // },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string>('');

  useEffect(() => {
    const currentItem = MENU_ITEMS.find((item) => item.href === pathname);
    if (currentItem) {
      setActiveItem(currentItem.label);
    }

    // 全てのメニュー項目のページを事前読み込み
    for (const item of MENU_ITEMS) {
      if (item.href !== pathname) {
        router.prefetch(item.href);
      }
    }
  }, [pathname, router]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    const item = MENU_ITEMS.find((i) => i.label === label);
    if (item) {
      router.push(item.href);
    }
  };

  return (
    <div className="bg-white dark:bg-background border-b border-gray-100 shadow-sm backdrop-blur-sm sticky top-0 z-50 max-md:hidden">
      <div className="container mx-auto flex items-center justify-between">
        <SiteLogo />
        <MenuBar
          items={MENU_ITEMS}
          activeItem={activeItem}
          onItemClick={handleItemClick}
          className="bg-transparent border-none shadow-none"
        />
      </div>
    </div>
  );
}
