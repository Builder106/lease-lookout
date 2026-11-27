import './walkthrough.css';

import { WalkthroughFrame } from '@/components/walkthrough/WalkthroughFrame';

// The apartment lives in the layout so it stays mounted while rooms open and close.
export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return <WalkthroughFrame>{children}</WalkthroughFrame>;
}
