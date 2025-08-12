import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VAN Marketing Intelligence - Executive Dashboard',
  description: 'Real-time executive dashboard for VAN Marketing Agent Suite - 15-agent lead generation system',
  keywords: 'marketing, dashboard, AI agents, lead generation, business intelligence, VAN',
  authors: [{ name: 'VAN Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}