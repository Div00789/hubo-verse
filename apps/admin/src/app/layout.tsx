import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HuboExperts Operations Admin — HuboVerse',
  description: 'Global multi-tenant platform oversight, Anna AI telemetry, and client organisation administration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-[#F8FAFC] antialiased">
        {children}
      </body>
    </html>
  );
}
