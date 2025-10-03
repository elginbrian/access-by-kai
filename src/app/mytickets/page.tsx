"use client";

import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import { useRouter } from "next/navigation";
import NavBarServices from "@/components/navbar/NavBarServices";
import ServiceCard from "@/components/mytickets/ServiceCard";
import TicketCard from "@/components/mytickets/TicketCard";
import InputField from "@/components/input/InputField";
import { useUserTickets } from "@/lib/hooks/useTickets";
import { useAuth } from "@/lib/auth/AuthContext";
import type { TicketListParams } from "@/types/ticket";

const MyTicketsPage: React.FC = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed" | "cancelled">("all");

  const ticketParams: TicketListParams = {
    ...(activeFilter !== "all" && { status: activeFilter as any }),
    limit: 50,
  };

  const rawUserId = user?.profile?.user_id;
  const parsedUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);

  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useUserTickets(parsedUserId, ticketParams);

  const filteredTickets = tickets.filter(
    (ticket: any) => ticket.trainName.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) || ticket.passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const services = [
    { icon: "/ic_meal_blue.svg", title: "Makanan Tambahan", description: "Pesan makanan khusus untuk perjalanan Anda", link: "Lihat Menu" },
    { icon: "/ic_luggage_blue.svg", title: "E - Porter", description: "Tambah keamanan bagasi untuk kebutuhan Anda", link: "Pesan Bagasi" },
    { icon: "/ic_car.svg", title: "Shower Locker & Luxury Lounge", description: "Pesan fasilitas tambah untuk kenyamanan Anda", link: "Lihat Opsi" },
  ];

  if (authLoading || ticketsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBarServices />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Memuat tiket Anda...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!authLoading && Number.isNaN(parsedUserId)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBarServices />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profil belum lengkap</h3>
            <p className="text-gray-600 mb-4">Mohon lengkapi profil Anda agar user_id numerik tersedia.</p>
          </div>
        </main>
      </div>
    );
  }

  if (ticketsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBarServices />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <Icon name="alert" className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal memuat tiket</h3>
            <p className="text-gray-600 mb-4">Terjadi kesalahan saat mengambil data tiket Anda.</p>
            <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBarServices />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs + Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-[#7c53f0] text-white font-medium shadow-sm">Kereta Jarak Jauh</button>
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Kereta lokal</button>
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Kereta Bandara</button>
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">Whoosh</button>
            <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-400">LRT</button>
          </div>

          <div className="w-full md:w-80">
            <InputField
              label=""
              placeholder="Cari tiket, kereta, atau penumpang..."
              value={searchQuery}
              onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchQuery(e.target.value)}
              className="w-full rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              lefticon={<Icon name="search" className="w-5 h-5 text-gray-400" />}
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Tambah Layanan</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {services.map((s, i) => (
            <ServiceCard key={i} icon={s.icon} title={s.title} description={s.description} linkText={s.link} onClick={() => console.log("service", s.title)} />
          ))}
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tiket Kereta Saya</h2>
              <p className="text-gray-600 mb-6">Detail perjalanan kereta api Anda</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setActiveFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                Semua
              </button>
              <button
                onClick={() => setActiveFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Aktif
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "completed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Selesai
              </button>
              <button
                onClick={() => setActiveFilter("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === "cancelled" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Dibatalkan
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Icon name="file" className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{searchQuery ? "Tidak ada tiket yang ditemukan" : "Belum ada tiket"}</h3>
              <p className="text-gray-600 mb-4">{searchQuery ? `Tidak ditemukan tiket yang sesuai dengan "${searchQuery}"` : "Anda belum memiliki tiket perjalanan kereta api."}</p>
              {!searchQuery && (
                <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Pesan Tiket Sekarang
                </button>
              )}
            </div>
          ) : (
            filteredTickets.map((ticket: any, index: number) => (
              <TicketCard
                key={ticket.id || index}
                ticket={{
                  id: ticket.id ?? `unknown-${index}`,
                  ticketNumber: ticket.ticketNumber ?? ticket.id ?? `unknown-${index}`,
                  trainName: ticket.trainName ?? "-",
                  date: ticket.date ?? "-",
                  duration: ticket.duration ?? "-",
                  passenger: ticket.passenger?.name ?? "-",
                  car: ticket.seat?.car ?? "-",
                  seat: ticket.seat?.number ?? "-",
                  class: ticket.seat?.class ?? "-",
                  totalPrice: ticket.price?.total ? `Rp ${ticket.price.total.toLocaleString("id-ID")}` : "-",
                }}
                onDetail={() => router.push(`/mytickets/${ticket.tiketId ?? ticket.ticketNumber ?? ticket.id}`)}
              />
            ))
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Icon name="grid" className="w-5 h-5" />
            <span className="font-bold">RailTravel</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 RailTravel. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default MyTicketsPage;
