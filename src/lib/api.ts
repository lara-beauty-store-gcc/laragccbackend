/**
 * Browser: same-origin `/api/v1/*` proxy (no build-time env required).
 * Server: `API_URL` or production default.
 */
const PRODUCTION_API = 'https://api.larabeauty.store';

export function getServerApiUrl(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    PRODUCTION_API
  );
}

/** Base URL for client-side fetches. Prefer direct API (CORS allowed) so orders work even without /api proxy route. */
export function getClientApiBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'larabeauty.store' || host === 'www.larabeauty.store') {
      return PRODUCTION_API;
    }
  }

  return '';
}

export function ordersEndpoint(): string {
  const base = getClientApiBase();
  return base ? `${base}/api/v1/orders` : '/api/v1/orders';
}
