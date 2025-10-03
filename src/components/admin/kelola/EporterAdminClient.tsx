"use client";

import React from "react";
import { useEporterPorters } from "@/lib/hooks/useEporterPorters";
import { useEporterBookingsList } from "@/lib/hooks/useEporterBookings";
import TableKelola from "@/components/admin/table/TableKelola";
import type { Column } from "@/components/admin/table/TableKelola";

type PorterRow = {
  id: string;
  namaPorter: string;
  nomorTelepon: string;
  stasiun: string;
  status: string;
  tugasSelesai: number;
  rating?: number;
  layananTags?: string[];
};

type BookingRow = {
  id: string;
  namaPemesan: string;
  nomorKereta: string;
  waktuKeberangkatan: string;
  jenisLayanan: string;
  status: string;
  porter?: string | null;
};

export default function EporterAdminClient() {
  const portersQuery = useEporterPorters();
  const bookingsQuery = useEporterBookingsList();

  const porterColumns: Column<PorterRow>[] = [
    { key: "namaPorter", label: "Nama Porter", render: (r) => <div className="font-medium text-gray-800">{r.namaPorter}</div> },
    { key: "nomorTelepon", label: "Nomor Telepon" },
    { key: "stasiun", label: "Stasiun" },
    { key: "status", label: "Status" },
    { key: "tugasSelesai", label: "Tugas Selesai" },
  ];

  const bookingColumns: Column<BookingRow>[] = [
    { key: "id", label: "ID Booking" },
    { key: "namaPemesan", label: "Nama Pemesan" },
    { key: "nomorKereta", label: "Nomor Kereta / Rute" },
    { key: "waktuKeberangkatan", label: "Waktu Keberangkatan" },
    { key: "jenisLayanan", label: "Jenis Layanan" },
    { key: "status", label: "Status" },
    { key: "porter", label: "Porter Assigned" },
  ];

  const porters = (portersQuery.data || []).map((p: any) => ({
    id: p.id,
    namaPorter: p.name,
    nomorTelepon: p.phone_number ?? p.whatsapp_number ?? "-",
    stasiun: "-",
    status: p.status ?? (p.is_available ? "Tersedia" : "Tidak tersedia"),
    tugasSelesai: 0,
    rating: undefined,
  }));

  const bookings = (bookingsQuery.data || []).map((b: any) => ({
    id: String(b.booking_id ?? b.id ?? b.pesan_id ?? b.id_booking ?? Math.random()),
    namaPemesan: b.nama_pemesan ?? b.nama ?? b.customer_name ?? "-",
    nomorKereta: b.nomor_kereta ?? b.train_number ?? "-",
    waktuKeberangkatan: b.waktu_keberangkatan ?? b.departure_time ?? "-",
    jenisLayanan: b.jenis_layanan ?? b.service_type ?? "-",
    status: b.status ?? "-",
    porter: b.porter_name ?? b.porter ?? null,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm">
        <TableKelola
          title="Data Porter"
          description="Kelola data porter dan status ketersediaan"
          data={porters}
          columns={porterColumns as any}
          perPage={10}
          onEdit={(r) => console.log("edit", r)}
          onDelete={(r) => console.log("delete", r)}
          onAdd={() => console.log("add")}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <TableKelola
          title="Daftar Permintaan e-Porter"
          description="Kelola permintaan layanan porter dari penumpang"
          data={bookings}
          columns={bookingColumns as any}
          perPage={10}
          onEdit={(r) => console.log("edit booking", r)}
          onDelete={(r) => console.log("delete booking", r)}
        />
      </div>
    </div>
  );
}
