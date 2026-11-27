import type { Metadata } from 'next';

import { SiteFooter, SiteHeader } from '@/components/Landing';
import { Walkthrough } from '@/components/Walkthrough';

export const metadata: Metadata = {
  title: 'Move-in walkthrough: LeaseLookout',
  description:
    'Photograph each room on move-in day and get a dated condition record, described on your device when it can be, even without Wi-Fi.',
};

export default function WalkthroughPage() {
  return (
    <>
      <SiteHeader />
      <Walkthrough />
      <SiteFooter />
    </>
  );
}
