'use client';

import Image from 'next/image';
import Link from 'next/link';

export const SiteLogo = () => {
  return (
    <Link href="/" prefetch={true}>
      <Image
        src="/images/site-logo-light.png"
        alt="logo"
        className="cursor-pointer pt-1.5 ml-8 block dark:hidden"
        height={40}
        width={100}
      />
      <Image
        src="/images/site-logo-dark.png"
        alt="logo"
        className="cursor-pointer pt-1.5 ml-8 hidden dark:block"
        height={40}
        width={100}
      />
    </Link>
  );
};
