import type { Metadata } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';

import './globals.css';

// Brand type (DESIGN.md): one grotesk, extra bold capitals for headlines;
// mono for citations and stamps.
const text = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-text', display: 'swap' });
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'LeaseLookout: get your security deposit back',
  description:
    "Record your apartment at move-in, know your landlord's legal deadline at move-out, and ask for your deposit with the statute in hand. Open source. Not legal advice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${text.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
