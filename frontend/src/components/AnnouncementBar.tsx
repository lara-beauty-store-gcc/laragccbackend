import { getAnnouncementText } from '@/lib/marketing';
import { IconShield } from './icons';

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs text-white">
      <p className="flex items-center justify-center gap-2 font-arabic">
        <IconShield className="h-4 w-4 shrink-0 text-accent" />
        {getAnnouncementText()}
      </p>
    </div>
  );
}
