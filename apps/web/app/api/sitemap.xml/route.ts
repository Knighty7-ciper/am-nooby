import { getPublishedPosts } from '@noobblog/database';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'

/**
 * Sitemap Generator
 */
export async function GET(request: NextRequest) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noobblog.com';
    
    // Get all published posts (you may want to paginate for large sites)
    const { posts } = await getPublishedPosts({ limit: 1000, page: 1 });
    
    const sitemap = generateSitemap(posts, siteUrl);
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}

function generateSitemap(posts: any[], siteUrl: string): string {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/search', priority: '0.7', changefreq: 'weekly' },
  ];
  
  const staticUrls = staticPages
    .map(
      (page) => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('');
  
  const postUrls = posts
    .map(
      (post) => `
  <url>
    <loc>${siteUrl}/post/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${postUrls}
</urlset>`;
}
