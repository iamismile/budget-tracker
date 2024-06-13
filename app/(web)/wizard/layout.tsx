import { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-screen flex w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}

export default Layout;
