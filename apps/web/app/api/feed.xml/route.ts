import { getPublishedPosts } from '@noobblog/database';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

/**
 * RSS Feed Generator
 */
export async function GET(request: NextRequest) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noobblog.com';
    
    // Get latest 50 published posts
    const { posts } = await getPublishedPosts({ limit: 50, page: 1 });
    
    const rss = generateRssFeed(posts, siteUrl);
    
    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('RSS generation error:', error);
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}

function generateRssFeed(posts: any[], siteUrl: string): string {
  const feedItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/post/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author><![CDATA[${post.author.name}]]></author>
      ${post.category ? `<category><![CDATA[${post.category.name}]]></category>` : ''}
      ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg"/>` : ''}
    </item>`
    )
    .join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>NoobBlog</title>
    <link>${siteUrl}</link>
    <description>A modern blogging platform for developers and creators</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${feedItems}
  </channel>
</rss>`;
}
