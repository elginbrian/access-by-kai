"use client";

import React, { useMemo, useState } from "react";
import { colors } from "@/app/design-system/colors";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import ProfileFilters from "@/components/profile/ProfileFilters";
import ProfileTicketCard from "@/components/profile/ProfileTicketCard";
import ProfilePagination from "@/components/profile/ProfilePagination";
import { useUserTickets } from "@/lib/hooks/useTickets";
import { useAuth } from "@/lib/auth/AuthContext";
import type { Pengguna } from "@/types/models";

interface Props {
  profile?: Pengguna | null;
}

const ProfilePageClient: React.FC<Props> = ({ profile }) => {
  const { user } = useAuth();
  const numericUserId = profile?.user_id ?? (user?.profile?.user_id as number | undefined);

  const parsedUserId = numericUserId == null ? NaN : typeof numericUserId === "string" ? parseInt(numericUserId as any, 10) : (numericUserId as number);

  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useUserTickets(parsedUserId, { limit: 50 });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [dateRange, setDateRange] = useState("30 Hari Terakhir");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const mappedTickets = useMemo(() => {
    const fmtDate = (d?: string) => {
      if (!d) return "-";
      try {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return d;
        return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      } catch (e) {
        return d;
      }
    };

    const fmtTime = (d?: string) => {
      if (!d) return "-";
      try {
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return d;
        return dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      } catch (e) {
        return d;
      }
    };

    return (tickets || []).map((t) => {
      const statusLabel = t.status === "active" ? "Akan Datang" : t.status === "completed" ? "Selesai" : t.status === "cancelled" ? "Dibatalkan" : t.status;
      const depTime = fmtTime(t.departureTime);
      const arrTime = fmtTime(t.arrivalTime);
      const time = `${depTime} - ${arrTime}`;
      const price = t.price?.total ? `Rp ${Number(t.price.total).toLocaleString("id-ID")}` : "-";

      const fromLabel = t.departureStation?.code ?? t.departureStation?.name ?? "-";
      const toLabel = t.arrivalStation?.code ?? t.arrivalStation?.name ?? "-";

      return {
        id: t.tiketId ? String(t.tiketId) : t.id || t.ticketNumber,
        status: statusLabel,
        title: t.trainName || "-",
        class: t.seat?.class || "-",
        from: fromLabel,
        to: toLabel,
        time,
        price,
        people: 1,
        date: fmtDate(t.date),
      };
    });
  }, [tickets]);

  const totalPages = Math.ceil(mappedTickets.length / itemsPerPage);
  const paginatedTickets = mappedTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: colors.base.lightHover }}>
      <ProfileSidebar 
        profile={profile ?? undefined} 
        kaiPayBalance={125000} 
        railPointBalance={2450} 
      />

      <div className="flex-1 ml-80 bg-[#f9fafb]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section>
            <ProfileFilters selectedStatus={statusFilter} onStatusChange={setStatusFilter} searchQuery={query} onSearchChange={(e) => setQuery(e.target.value)} dateRange={dateRange} onDateRangeChange={setDateRange} />

            <div className="space-y-6">
              {ticketsLoading && <div className="text-center py-12">Memuat tiket...</div>}

              {!ticketsLoading && paginatedTickets.length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.base.darker }}>
                    Tidak ada tiket ditemukan
                  </h3>
                  <p style={{ color: colors.base.darkActive }}>Coba ubah filter pencarian Anda</p>
                </div>
              )}

              {paginatedTickets.map((ticket, index) => (
                <ProfileTicketCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </div>

            <ProfilePagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageClient;
