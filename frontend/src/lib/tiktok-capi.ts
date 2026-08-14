import { hashPhoneForTikTok, sha256 } from '@/lib/hash';

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

export function purchaseEventId(orderId: string): string {
  return `purchase_${orderId}`;
}

export async function sendTikTokPurchase(
  payload: CapiPurchasePayload,
  context: CapiContext = {},
): Promise<{ ok: boolean; skipped?: boolean; reason?: string }> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN?.trim();
  const pixelId = (process.env.TIKTOK_PIXEL_ID || 'D9V4EIJC77U9RA6QKBL0').trim();

  if (!accessToken) {
    return { ok: true, skipped: true, reason: 'tiktok_not_configured' };
  }

  const body = {
    event_source: 'web',
    event_source_id: pixelId,
    data: [
      {
        event: 'CompletePayment',
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        user: {
          ip: context.ip,
          user_agent: context.userAgent,
          email: payload.email ? sha256(payload.email) : undefined,
          phone: payload.phone ? hashPhoneForTikTok(payload.phone) : undefined,
        },
        properties: {
          currency: payload.currency,
          value: payload.value,
          content_type: 'product',
          content_ids: payload.contentIds,
          order_id: payload.orderId,
        },
        page: {
          url: payload.sourceUrl,
        },
      },
    ],
  };

  const apiVersion = process.env.TIKTOK_API_VERSION?.trim() || 'v1.3';
  const url = `https://business-api.tiktok.com/open_api/${apiVersion}/event/track/`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.code !== 0) {
      console.warn('[tiktok-capi]', res.status, json);
      return { ok: false, reason: 'tiktok_api_error' };
    }
    return { ok: true };
  } catch (err) {
    console.warn('[tiktok-capi] request failed', err);
    return { ok: false, reason: 'tiktok_request_failed' };
  }
}
