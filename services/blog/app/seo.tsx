import type { Metadata } from 'next';
import siteMetadata from '@/data/siteMetadata';

interface PageSEOProps {
  title: string;
  description?: string;
  image?: string;
  locale?: 'ko' | 'en';
  // 서빙 URL 기준 절대 경로. 주면 canonical·og:url을 siteUrl+path로. 없으면 둘 다 출력 안 함 (틀린 URL보다 부재가 낫다)
  path?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function genPageMetadata({ title, description, image, locale, path, ...rest }: PageSEOProps): Metadata {
  const canonicalUrl = path ? `${siteMetadata.siteUrl}${path}` : undefined;
  return {
    title,
    description: description || siteMetadata.description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      ...(canonicalUrl && { url: canonicalUrl }),
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
      type: 'website',
    },
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    ...rest,
  };
}
