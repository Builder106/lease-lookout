import './walkthrough.css';

import { Big_Shoulders_Stencil } from 'next/font/google';

import { WalkthroughFrame } from '@/components/walkthrough/WalkthroughFrame';

// Room names and headlines are lettered like moving boxes: the stencil label
// on every box that says which room it goes to.
const boxLabel = Big_Shoulders_Stencil({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-box',
  display: 'swap',
});

// The apartment lives in the layout so it stays mounted while rooms open and close.
export default function WalkthroughLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={boxLabel.variable}>
      <WalkthroughFrame>{children}</WalkthroughFrame>
    </div>
  );
}
