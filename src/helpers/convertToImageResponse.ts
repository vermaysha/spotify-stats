import type { VercelResponse } from '@vercel/node';

export function convertToImageResponse(res: VercelResponse) {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control','s-maxage=1, stale-while-revalidate');
}
