import { config } from '../config.js';
import { log } from '../logger.js';

/**
 * MaxMind minFraud or GeoIP2 — basic country/risk check via Insights API.
 * Returns { allowed: true } when disabled or whitelisted.
 */
export async function checkIpRisk(ip, phoneDigits = '') {
  if (!config.enableIpFraudCheck) {
    return { allowed: true, skipped: true, reason: 'fraud_check_disabled' };
  }

  const whitelisted = config.whitelistedPhones.some(
    (p) => phoneDigits && (phoneDigits.endsWith(p) || p.endsWith(phoneDigits)),
  );
  if (whitelisted) {
    return { allowed: true, skipped: true, reason: 'phone_whitelisted' };
  }

  if (!config.maxmind.accountId || !config.maxmind.licenseKey) {
    log.warn('MaxMind enabled but MAXMIND_ACCOUNT_ID or MAXMIND_LICENSE_KEY missing');
    return { allowed: true, skipped: true, reason: 'maxmind_not_configured' };
  }

  if (!ip || ip === '127.0.0.1' || ip.startsWith('::')) {
    return { allowed: true, skipped: true, reason: 'no_client_ip' };
  }

  try {
    const auth = Buffer.from(
      `${config.maxmind.accountId}:${config.maxmind.licenseKey}`,
    ).toString('base64');

    const res = await fetch(
      `https://minfraud.maxmind.com/minfraud/v2.0/insights`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device: { ip_address: ip },
        }),
      },
    );

    if (!res.ok) {
      log.warn('MaxMind API error', res.status, await res.text());
      return { allowed: true, skipped: true, reason: 'maxmind_api_error' };
    }

    const data = await res.json();
    const risk = data?.risk?.score ?? 0;
    const allowed = risk < 50;

    return {
      allowed,
      risk,
      reason: allowed ? 'ok' : 'high_risk_score',
      country: data?.country?.iso_code,
    };
  } catch (err) {
    log.error('MaxMind check failed', err.message);
    return { allowed: true, skipped: true, reason: 'maxmind_exception' };
  }
}
