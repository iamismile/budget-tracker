import Navbar from '@/components/Navbar';
import { ReactNode } from 'react';

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-col h-screen w-full">
      <Navbar />
      {children}
    </div>
  );
}

export default DashboardLayout;
