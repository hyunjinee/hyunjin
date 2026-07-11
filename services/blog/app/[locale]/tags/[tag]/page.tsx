import type { Metadata } from 'next';
import { slug } from 'github-slugger';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayoutWithTags';
import tagData from 'app/tag-data.json';
import { genPageMetadata } from 'app/seo';
import { isLocale, localePath, postsForLocale, LOCALES } from 'lib/posts';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: rawTag } = await params;
  const tag = decodeURI(rawTag);
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}${localePath(isLocale(locale) ? locale : 'ko', `/tags/${tag}/feed.xml`)}`,
      },
    },
  });
}

export const generateStaticParams = async () => {
  const data = tagData as Record<string, Record<string, number>>;
  return LOCALES.flatMap((locale) => Object.keys(data[locale]).map((tag) => ({ locale, tag: encodeURI(tag) })));
};

export default async function TagPage({ params }: { params: Promise<{ locale: string; tag: string }> }) {
  const { locale, tag: rawTag } = await params;
  if (!isLocale(locale)) notFound();
  const tag = decodeURI(rawTag);
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);
  const filteredPosts = allCoreContent(
    sortPosts(postsForLocale(locale).filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))),
  );
  if (filteredPosts.length === 0) {
    return notFound();
  }
  return <ListLayout posts={filteredPosts} title={title} />;
}
