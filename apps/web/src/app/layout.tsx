import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HuboVerse — The AI-Powered HubSpot Learning & Operations Platform',
  description: 'Enterprise education, LiveKit live coaching, Anna AI automation, and CRM operations in one unified workspace.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full w-full overflow-x-hidden bg-[#090D16] text-[#F8FAFC] antialiased selection:bg-[#FF5C00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
