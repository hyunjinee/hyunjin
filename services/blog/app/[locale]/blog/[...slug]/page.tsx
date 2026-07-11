import 'css/prism.css';
import 'katex/dist/katex.css';

import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import { components } from '@/components/MDXComponents';
import { MDXLayoutRenderer } from 'pliny/mdx-components';
import { coreContent } from 'pliny/utils/contentlayer';
import { allAuthors } from 'contentlayer/generated';
import type { Authors, Blog } from 'contentlayer/generated';
import PostSimple from '@/layouts/PostSimple';
import PostLayout from '@/layouts/PostLayout';
import PostBanner from '@/layouts/PostBanner';
import siteMetadata from '@/data/siteMetadata';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { slug as slugify } from 'github-slugger';
import { coreListFor, findBySlug, pairOf, postUrl, postsForLocale, isLocale, LOCALES, type Locale } from 'lib/posts';

const defaultLayout = 'PostLayout';

const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata | undefined> {
  const awaited = await params;
  if (!isLocale(awaited.locale)) return undefined;
  const locale = awaited.locale;

  const slug = decodeURI(awaited.slug.join('/'));
  const post = findBySlug(locale, slug);
  const authorList = post?.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  if (!post) {
    return;
  }

  const publishedAt = new Date(post.date).toISOString();
  const modifiedAt = new Date(post.lastmod || post.date).toISOString();
  const authors = authorDetails.map((author) => author.name);
  // 이미지 없는 글의 동적 OG 카드: 첫 태그를 subtitle로 넣어 글 주제를 노출
  const ogSubtitle = post.tags?.[0] ? `&subtitle=${encodeURIComponent(post.tags[0])}` : '';
  let imageList = [`${siteMetadata.siteUrl}/og?title=${encodeURIComponent(post.title)}${ogSubtitle}`];
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    };
  });

  const canonical = `${siteMetadata.siteUrl}${postUrl(post.locale as Locale, post.slug as string)}`;
  const pair = pairOf(post);

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical,
      ...(pair && {
        languages: {
          ko: `${siteMetadata.siteUrl}${postUrl('ko', pair.ko.slug as string)}`,
          en: `${siteMetadata.siteUrl}${postUrl('en', pair.en.slug as string)}`,
          // 어느 locale에도 안 맞는 국제 사용자에게는 영어 (ADR-0002)
          'x-default': `${siteMetadata.siteUrl}${postUrl('en', pair.en.slug as string)}`,
        },
      }),
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: post.locale === 'en' ? 'en_US' : 'ko_KR',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonical,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  };
}

export const generateStaticParams = async () => {
  // slug는 computed field라 항상 존재하지만, frontmatter의 optional slug 필드와 이름이 겹쳐 타입이 optional로 생성됨
  // draft는 프로덕션에서 404 처리되므로 정적 경로에서 제외
  return LOCALES.flatMap((locale) =>
    postsForLocale(locale)
      .filter((p) => !p.draft)
      .map((p) => ({ locale, slug: (p.slug as string).split('/').map((name) => decodeURI(name)) })),
  );
};

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const awaited = await params;
  if (!isLocale(awaited.locale)) return notFound();
  const locale = awaited.locale;
  const slug = decodeURI(awaited.slug.join('/'));

  const sortedCoreContents = coreListFor(locale); // 심사 지적 반영: prev/next가 같은 locale 안에서만 돈다
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    // 1) 반대 locale에 존재하는 slug면 그쪽 정규 URL로 안내 (쌍이 있으면 요청 locale의 쌍으로)
    //    나중에 번역이 생기면 목적지가 바뀌므로 308(영구, 브라우저 캐시)이 아니라 307(redirect)을 쓴다
    const other: Locale = locale === 'ko' ? 'en' : 'ko';
    const crossPost = findBySlug(other, slug);
    if (crossPost) {
      const pair = pairOf(crossPost);
      const target = pair ? pair[locale] : crossPost;
      redirect(postUrl(target.locale as Locale, target.slug as string));
    }
    // 2) 기존 legacy 슬러그 301 로직: 전체 목록 대신 postsForLocale('ko')로 교체해 유지
    const requested = slugify(slug);
    const legacy = postsForLocale('ko').find(
      (p) => p.slug === requested || slugify(p._raw.flattenedPath.replace(/^.+?(\/)/, '')) === requested,
    );
    if (legacy) permanentRedirect(`/blog/${legacy.slug}`);
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = findBySlug(locale, slug) as Blog;
  const authorList = post?.authors || ['default'];
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author);
    return coreContent(authorResults as Authors);
  });
  const mainContent = coreContent(post);
  const jsonLd = post.structuredData;
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    };
  });

  const pair = pairOf(post);
  const altLocale = pair
    ? locale === 'ko'
      ? { href: postUrl('en', pair.en.slug as string), label: 'Read in English →' }
      : { href: postUrl('ko', pair.ko.slug as string), label: '한국어로 읽기 →' }
    : undefined;

  const Layout = layouts[post.layout || defaultLayout];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev} altLocale={altLocale}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  );
}
