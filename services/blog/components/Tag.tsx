'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { slug } from 'github-slugger';
import { stripLocalePrefix, localePath } from 'lib/locale';

interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  const pathname = usePathname() ?? '/';
  const { locale } = stripLocalePrefix(pathname);
  return (
    <Link
      href={localePath(locale, `/tags/${slug(text)}`)}
      className="mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {text.split(' ').join('-')}
    </Link>
  );
};

export default Tag;
