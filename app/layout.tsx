import RootProvider from '@/components/providers/RootProvider';
import { Toaster } from '@/components/ui/sonner';
import { ClerkProvider, RedirectToSignIn, SignedOut } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Budget Tracker',
  description: 'Track your budgets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: 'dark',
        }}
      >
        <body className={inter.className}>
          <Toaster richColors position="bottom-right" />
          <RootProvider>{children}</RootProvider>
        </body>
      </html>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
