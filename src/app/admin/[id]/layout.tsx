import React from 'react';
import NavBarAdmin from '@/components/navbar/NavBarAdmin';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Navigation Sidebar */}
      <NavBarAdmin />

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}