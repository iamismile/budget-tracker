import { Logo } from '@/components/Logo';
import { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen flex w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}

export default Layout;
