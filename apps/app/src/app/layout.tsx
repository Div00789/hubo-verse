import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HuboVerse — AI-Powered HubSpot Learning & Operations Platform',
  description: 'Enterprise HubSpot learning, automation, and live client operations SaaS.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-[#F8FAFC] antialiased overflow-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
