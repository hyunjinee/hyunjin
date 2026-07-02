import 'css/prism.css';
import 'katex/dist/katex.css';

import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import { components } from '@/components/MDXComponents';
import { MDXLayoutRenderer } from 'pliny/mdx-components';
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer';
import { allBlogs, allAuthors } from 'contentlayer/generated';
import type { Authors, Blog } from 'contentlayer/generated';
import PostSimple from '@/layouts/PostSimple';
import PostLayout from '@/layouts/PostLayout';
import PostBanner from '@/layouts/PostBanner';
import siteMetadata from '@/data/siteMetadata';
import { notFound, permanentRedirect } from 'next/navigation';
import { slug as slugify } from 'github-slugger';

const defaultLayout = 'PostLayout';

const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata | undefined> {
  const test = await params;

  const slug = decodeURI(test.slug.join('/'));
  const post = allBlogs.find((p) => p.slug === slug);
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
  let imageList = [`${siteMetadata.siteUrl}/og?title=${encodeURIComponent(post.title)}`];
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images;
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    };
  });

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'ko_KR',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
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
  return allBlogs.map((p) => ({ slug: (p.slug as string).split('/').map((name) => decodeURI(name)) }));
};

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const test = await params;

  const slug = decodeURI(test.slug.join('/'));
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs));
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    // 구 URL(한글 파일명·대소문자 변형)을 새 슬러그로 301
    const requested = slugify(slug);
    const legacy = allBlogs.find(
      (p) => p.slug === requested || slugify(p._raw.flattenedPath.replace(/^.+?(\/)/, '')) === requested,
    );
    if (legacy) {
      permanentRedirect(`/blog/${legacy.slug}`);
    }
    return notFound();
  }

  const prev = sortedCoreContents[postIndex + 1];
  const next = sortedCoreContents[postIndex - 1];
  const post = allBlogs.find((p) => p.slug === slug) as Blog;
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

  const Layout = layouts[post.layout || defaultLayout];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  );
}
