"use client";

import React, { useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
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

  // If no profile is found, show error
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.base.lightHover }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alert" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.base.darker }}>
            Profil tidak ditemukan
          </h3>
          <p style={{ color: colors.base.darkActive }} className="mb-4">
            Profil yang Anda cari tidak ditemukan atau tidak dapat diakses.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Use the passed profile, or fall back to current user's profile
  const currentProfile = profile || user?.profile;
  const numericUserId = currentProfile?.user_id ?? (user?.profile?.user_id as number | undefined);

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
        profile={currentProfile} 
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
                    <Icon name="file" className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: colors.base.darker }}>
                    Tidak ada tiket ditemukan
                  </h3>
                  <p style={{ color: colors.base.darkActive }}>Coba ubah filter pencarian Anda</p>
                </div>
              )}

              {paginatedTickets.map((ticket, index) => (
                <ProfileTicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  index={index} 
                  userId={isNaN(parsedUserId) ? '' : String(parsedUserId)} 
                />
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
