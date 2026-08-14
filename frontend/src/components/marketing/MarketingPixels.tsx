import { SnapPixel } from './SnapPixel';
import { TikTokPixel } from './TikTokPixel';

/** Browser pixels loaded on every page (TikTok + Snap). */
export function MarketingPixels() {
  return (
    <>
      <TikTokPixel />
      <SnapPixel />
    </>
  );
}
