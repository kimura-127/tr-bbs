'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const SiteLogo = () => {
  const router = useRouter();
  const handleLogoClick = () => {
    router.refresh();
    router.push('/');
  };

  return (
    <Image
      onClick={handleLogoClick}
      src="/images/site-logo-white.png"
      alt="logo"
      className="cursor-pointer pt-1.5 ml-8"
      height={40}
      width={100}
    />
  );
};
