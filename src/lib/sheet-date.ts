const DUBAI_TZ = 'Asia/Dubai';

/** Always `yyyy-MM-dd HH:mm` in UAE (Asia/Dubai) — never ISO in the sheet. */
export function formatSheetDate(date?: string | Date): string {
  const d =
    date instanceof Date ? date : date ? new Date(date) : new Date();
  if (Number.isNaN(d.getTime())) return '';

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: DUBAI_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}`;
}
