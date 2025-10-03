import React from "react";
import NavBarAdmin from "@/components/navbar/NavBarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <div className="flex-none">
        <NavBarAdmin />
      </div>

      <main className="flex-1 h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
