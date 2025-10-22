import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation endpoint
 * Usage: POST /api/revalidate with { path: '/post/my-slug' }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const secret = request.headers.get('x-revalidate-secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }
    
    const body = await request.json();
    const { path, tag } = body;
    
    if (!path && !tag) {
      return NextResponse.json(
        { error: 'Either path or tag is required' },
        { status: 400 }
      );
    }
    
    if (path) {
      revalidatePath(path);
    }
    
    if (tag) {
      // revalidateTag(tag); // Use this in production
    }
    
    return NextResponse.json({
      revalidated: true,
      path,
      tag,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
