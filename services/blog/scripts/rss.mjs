import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { slug } from 'github-slugger';
import { escape } from 'pliny/utils/htmlEscaper.js';
import siteMetadata from '../data/siteMetadata.js';
import tagData from '../app/tag-data.json' with { type: 'json' };
import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { sortPosts } from 'pliny/utils/contentlayer.js';

const postUrl = (post) => (post.locale === 'en' ? `/en/blog/${post.slug}` : `/blog/${post.slug}`);

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}${postUrl(post)}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}${postUrl(post)}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`;

const generateRss = (config, posts, page = 'feed.xml', language = config.language) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}${page.startsWith('en/') ? '/en/blog' : '/blog'}</link>
      <description>${escape(config.description)}</description>
      <language>${language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`;

async function generateRSS(config, allBlogs, page = 'feed.xml') {
  const publish = (posts) => posts.filter((post) => post.draft !== true);
  const ko = publish(allBlogs.filter((p) => p.locale === 'ko'));
  const en = publish(allBlogs.filter((p) => p.locale === 'en'));

  // RSS for ko blog posts
  if (ko.length > 0) {
    const rss = generateRss(config, sortPosts(ko));
    writeFileSync(`./public/${page}`, rss);
  }

  // RSS for en blog posts
  if (en.length > 0) {
    mkdirSync('./public/en', { recursive: true });
    const rss = generateRss(config, sortPosts(en), `en/${page}`, 'en-US');
    writeFileSync(`./public/en/${page}`, rss);
  }

  // Tag feeds for ko only
  for (const tag of Object.keys(tagData.ko)) {
    const filteredPosts = ko.filter((post) => post.tags.map((t) => slug(t)).includes(tag));
    if (filteredPosts.length === 0) continue;
    const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`);
    const rssPath = path.join('public', 'tags', tag);
    mkdirSync(rssPath, { recursive: true });
    writeFileSync(path.join(rssPath, page), rss);
  }
}

const rss = () => {
  generateRSS(siteMetadata, allBlogs);
  console.log('RSS feed generated...');
};
export default rss;
