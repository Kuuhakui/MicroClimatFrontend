import React from 'react';
import { Outlet } from 'react-router-dom'; // Добавь это
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet /> {/* Здесь будут рендериться Dashboard, Map и т.д. */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;