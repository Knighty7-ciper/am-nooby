import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

/**
 * Image optimization middleware
 */
export async function optimizeImage(
  imageBuffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<Buffer> {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  let image = sharp(imageBuffer);
  
  // Resize if dimensions provided
  if (width || height) {
    image = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  
  // Convert format and optimize
  switch (format) {
    case 'webp':
      image = image.webp({ quality });
      break;
    case 'jpeg':
      image = image.jpeg({ quality, progressive: true });
      break;
    case 'png':
      image = image.png({ quality, progressive: true });
      break;
  }
  
  return await image.toBuffer();
}

/**
 * Get optimized image URL with query params
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): string {
  const params = new URLSearchParams();
  
  if (options.width) params.set('w', String(options.width));
  if (options.height) params.set('h', String(options.height));
  if (options.quality) params.set('q', String(options.quality));
  if (options.format) params.set('f', options.format);
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map((width) => `${getOptimizedImageUrl(src, { width })} ${width}w`)
    .join(', ');
}

/**
 * Image optimization API route handler
 */
export async function handleImageOptimization(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    const width = request.nextUrl.searchParams.get('w');
    const height = request.nextUrl.searchParams.get('h');
    const quality = request.nextUrl.searchParams.get('q');
    const format = request.nextUrl.searchParams.get('f') as 'webp' | 'jpeg' | 'png' | null;
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Fetch original image
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 404 });
    }
    
    const imageBuffer = Buffer.from(await response.arrayBuffer());
    
    // Optimize
    const optimized = await optimizeImage(imageBuffer, {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      quality: quality ? parseInt(quality) : 80,
      format: format || 'webp',
    });
    
    // Return optimized image
    return new NextResponse(optimized, {
      headers: {
        'Content-Type': `image/${format || 'webp'}`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json({ error: 'Image optimization failed' }, { status: 500 });
  }
}
