export async function GET() {
  const { sheetsWebhookConfigured } = await import('@/lib/sheets-webhook');
  const { listUnsyncedOrderBatches } = await import('@/lib/order-store');

  const batches = await listUnsyncedOrderBatches();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

  return Response.json({
    status: 'ok',
    service: 'lara-beauty-store',
    repo: 'laragccbackend',
    branch: 'frontend',
    orderFlow: 'api-first',
    apiUrl: apiUrl ? 'configured' : 'missing',
    sheetsWebhook: sheetsWebhookConfigured() ? 'configured' : 'missing',
    unsyncedOrders: batches.reduce((sum, batch) => sum + batch.orderIds.length, 0),
    ordersProxy: true,
    timestamp: new Date().toISOString(),
  });
}
