import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className={cn(
        'lg:ml-64 transition-all duration-300 ease-in-out',
        'flex flex-col min-h-screen'
      )}>
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;