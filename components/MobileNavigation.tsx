'use client';

import { cn } from '@/lib/utils';
import { Bell, MessageCircle, ShoppingCart, Speech } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const useScroll = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return scrollDirection;
};

const MENU_ITEMS = [
  {
    icon: ShoppingCart,
    label: '取引',
    href: '/',
    iconColor: 'text-blue-500',
  },
  {
    icon: Speech,
    label: '雑談',
    href: '/free-talk',
    iconColor: 'text-orange-500',
  },
  {
    icon: MessageCircle,
    label: 'アバター',
    href: '/avatar',
    iconColor: 'text-green-500',
  },
  {
    icon: Bell,
    label: '通知',
    href: '/notificationSetting',
    iconColor: 'text-red-500',
  },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const [activeLabel, setActiveLabel] = useState<string>(() => {
    const currentMenuItem = MENU_ITEMS.find((item) => item.href === pathname);
    return currentMenuItem?.label || '';
  });
  const scrollDirection = useScroll();

  return (
    <nav
      className={cn(
        'md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border backdrop-blur-sm z-50 transition-opacity duration-200',
        scrollDirection === 'down' ? 'opacity-40' : 'opacity-100'
      )}
    >
      <div className="flex justify-around items-center h-16">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeLabel === item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActiveLabel(item.label)}
              className={cn(
                'flex flex-col items-center justify-start mt-2 w-full h-full space-y-1',
                'transition-colors duration-200',
                isActive ? item.iconColor : 'text-muted-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
