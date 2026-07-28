export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'lara-beauty-store',
    repo: 'laragccbackend',
    branch: 'frontend',
    ordersProxy: true,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://api.larabeauty.store',
    timestamp: new Date().toISOString(),
  });
}
