import { getServerApiUrl } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function proxyToBackend(request: Request, path: string) {
  const backend = getServerApiUrl().replace(/\/$/, '');
  const url = `${backend}${path}`;

  const res = await fetch(url, {
    method: request.method,
    headers: {
      'Content-Type': request.headers.get('content-type') || 'application/json',
    },
    body: await request.text(),
    cache: 'no-store',
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function POST(request: Request) {
  return proxyToBackend(request, '/api/v1/orders');
}
