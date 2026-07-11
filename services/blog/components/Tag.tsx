'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { slug } from 'github-slugger';

interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  const pathname = usePathname() ?? '/';
  const prefix = pathname === '/en' || pathname.startsWith('/en/') ? '/en' : '';
  return (
    <Link
      href={`${prefix}/tags/${slug(text)}`}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  );
};

export default Tag;
