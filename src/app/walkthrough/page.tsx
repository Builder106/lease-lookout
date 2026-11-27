import type { Metadata } from 'next';

import { WalkthroughIndex } from '@/components/walkthrough/WalkthroughIndex';

export const metadata: Metadata = {
  title: 'Move-in walkthrough: LeaseLookout',
  description:
    'Photograph each room on move-in day and pin every photo to your apartment, described on your device when it can be, even without Wi-Fi.',
};

export default function WalkthroughPage() {
  return <WalkthroughIndex />;
}
