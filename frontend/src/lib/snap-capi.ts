import { hashPhoneForSnap, sha256 } from '@/lib/hash';

export type CapiPurchasePayload = {
  orderId: string;
  eventId: string;
  value: number;
  currency: string;
  phone?: string;
  email?: string;
  sourceUrl?: string;
  contentIds?: string[];
};

type CapiContext = {
  ip?: string;
  userAgent?: string;
};

export async function sendSnapPurchase(
  payload: CapiPurchasePayload,
  context: CapiContext = {},
): Promise<{ ok: boolean; skipped?: boolean; reason?: string }> {
  const accessToken = process.env.SNAP_ACCESS_TOKEN?.trim();
  const pixelId = (process.env.SNAP_PIXEL_ID || '998e0cce-14e8-4cfb-b55e-e7eea8fe5f25').trim();

  if (!accessToken) {
    return { ok: true, skipped: true, reason: 'snap_not_configured' };
  }

  const eventData: Record<string, unknown> = {
    event_name: 'PURCHASE',
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    action_source: 'WEB',
    user_data: {
      ph: payload.phone ? [hashPhoneForSnap(payload.phone)] : undefined,
      em: payload.email ? [sha256(payload.email)] : undefined,
      client_ip_address: context.ip,
      client_user_agent: context.userAgent,
    },
    custom_data: {
      currency: payload.currency,
      value: payload.value,
      order_id: payload.orderId,
      content_ids: payload.contentIds,
    },
    event_source_url: payload.sourceUrl,
  };

  const testCode = process.env.SNAP_TEST_EVENT_CODE?.trim();
  const body: Record<string, unknown> = { data: [eventData] };
  if (testCode) {
    body.test_event_code = testCode;
  }

  const url = `https://tr.snapchat.com/v3/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn('[snap-capi]', res.status, json);
      return { ok: false, reason: 'snap_api_error' };
    }
    return { ok: true };
  } catch (err) {
    console.warn('[snap-capi] request failed', err);
    return { ok: false, reason: 'snap_request_failed' };
  }
}
