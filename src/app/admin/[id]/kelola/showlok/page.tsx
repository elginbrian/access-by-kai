"use client";

import React from "react";
import AiRecomendationCard from '@/components/admin/card/AiRecomendationCard';
import ChartMultiBar from '@/components/admin/chart/ChartMultiBar';
import ChartPie from '@/components/admin/chart/ChartPie';
import TableKelola, { Column } from '@/components/admin/table/TableKelola';

type ShowLocBooking = {
  id: string;
  jenisLayanan: 'Shower' | 'Locker' | 'Combo';
  namaPengguna: string;
  waktuMulai: string; // ISO or human readable
  waktuSelesai: string;
  stasiun: string;
  status: 'MENUNGGU_PEMBAYARAN' | 'DIBAYAR' | 'SEDANG_DIGUNAKAN' | 'SELESAI' | 'DIBATALKAN' | 'EXPIRED';
  harga?: string;
};

const mockBookings: ShowLocBooking[] = [
  { id: '#SL001', jenisLayanan: 'Shower', namaPengguna: 'Ahmad Rizki', waktuMulai: '2025-10-03T14:00:00', waktuSelesai: '2025-10-03T14:30:00', stasiun: 'Gambir', status: 'DIBAYAR', harga: 'Rp 25.000' },
  { id: '#SL002', jenisLayanan: 'Locker', namaPengguna: 'Sari Dewi', waktuMulai: '2025-10-03T10:00:00', waktuSelesai: '2025-10-03T18:00:00', stasiun: 'Bandung', status: 'SELESAI', harga: 'Rp 15.000' },
  { id: '#SL003', jenisLayanan: 'Shower', namaPengguna: 'Budi Santoso', waktuMulai: '2025-10-03T16:30:00', waktuSelesai: '2025-10-03T17:00:00', stasiun: 'Pasar Senen', status: 'DIBATALKAN', harga: 'Rp 0' },
  { id: '#SL004', jenisLayanan: 'Locker', namaPengguna: 'Maya Sari', waktuMulai: '2025-10-03T08:00:00', waktuSelesai: '2025-10-03T20:00:00', stasiun: 'Yogyakarta', status: 'DIBAYAR', harga: 'Rp 20.000' },
  { id: '#SL005', jenisLayanan: 'Shower', namaPengguna: 'Dodi Rahman', waktuMulai: '2025-10-03T11:15:00', waktuSelesai: '2025-10-03T11:45:00', stasiun: 'Surabaya', status: 'SELESAI', harga: 'Rp 25.000' },
];

export default function Page() {
  const columns: Column<ShowLocBooking>[] = [
    { key: 'id', label: 'ID Booking', render: (r) => <div className="font-medium text-gray-800">{r.id}</div> },
    { key: 'jenisLayanan', label: 'Jenis Layanan', render: (r) => (
      <div>
        {r.jenisLayanan === 'Shower' && <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">Shower</span>}
        {r.jenisLayanan === 'Locker' && <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">Locker</span>}
        {r.jenisLayanan === 'Combo' && <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">Combo</span>}
      </div>
    ) },
    { key: 'namaPengguna', label: 'Nama Pengguna', render: (r) => <div className="text-sm text-gray-700">{r.namaPengguna}</div> },
    { key: 'waktu', label: 'Waktu/Durasi', render: (r) => (
      <div className="text-sm text-gray-700">{new Date(r.waktuMulai).toLocaleString()} - {new Date(r.waktuSelesai).toLocaleTimeString()}</div>
    ) },
    { key: 'stasiun', label: 'Stasiun', render: (r) => <div className="text-sm text-gray-700">{r.stasiun}</div> },
    { key: 'status', label: 'Status', render: (r) => (
      <div>
        {r.status === 'DIBAYAR' && <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">Dibayar</span>}
        {r.status === 'SELESAI' && <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">Selesai</span>}
        {r.status === 'DIBATALKAN' && <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">Dibatalkan</span>}
        {r.status === 'MENUNGGU_PEMBAYARAN' && <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">Menunggu</span>}
        {r.status === 'SEDANG_DIGUNAKAN' && <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-medium">Sedang Digunakan</span>}
        {r.status === 'EXPIRED' && <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">Expired</span>}
      </div>
    ) },
    { key: 'harga', label: 'Harga', render: (r) => <div className="text-sm text-gray-700">{r.harga}</div> },
  ];

  const pieData = [
    { label: 'Tersisa', value: 13, color: '#e5e7eb' },
    { label: 'Terpakai', value: 87, color: '#3b82f6' },
  ];

  const barData = {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    series: [
      { name: 'Booking', color: '#10b981', values: [15, 18, 12, 16, 22, 28, 25] }
    ]
  };

  const handleEdit = (row: ShowLocBooking) => {
    // placeholder - in real integration, open drawer or navigate to edit page
    console.log('edit', row);
  };

  const handleDelete = (row: ShowLocBooking) => {
    // placeholder - in real integration, call API to cancel booking
    console.log('delete', row);
  };

  const handleAdd = () => {
    // placeholder - navigate to create booking page or open modal
    console.log('add booking');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Shower & Locker</h1>
            <p className="text-sm text-gray-500">Manajemen booking dan ketersediaan fasilitas</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Real-time Analysis</div>
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">A</div>
          </div>
        </header>

        <AiRecomendationCard
          title="AI Monitoring Facilities"
          subtitle="Pantauan fasilitas secara real-time dengan rekomendasi otomatis"
          items={[
            { text: 'Locker Gambir sudah 85% penuh.', tone: 'info' },
            { text: 'Rekomendasi: Arahkan pengguna baru ke Locker Pasar Senen.', tone: 'warning' },
            { text: 'Shower Room Bandung sangat tersedia (3 dari sore ini).', tone: 'success' },
            { text: 'Kirim notifikasi ke pengguna yang belum check-out locker.', tone: 'warning' },
          ]}
          cta={{ label: 'Kirim Notifikasi', variant: 'primary', onClick: () => console.log('send notification') }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tingkat Penggunaan Locker</h3>
            <div className="flex items-center justify-center">
              <ChartPie data={pieData} size={200} innerRadius={50} />
            </div>
            <div className="text-center mt-2">
              <div className="text-sm text-gray-600">Terpakai 87/100</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Shower per Hari</h3>
            <ChartMultiBar categories={barData.categories} series={barData.series} height={240} width={280} />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Kapasitas Locker</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">87%</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Durasi Rata-rata</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">23 min</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Revenue Mingguan</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">Rp 12.5M</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <TableKelola
            title="Daftar Booking Shower & Locker"
            description="Cari berdasarkan ID booking atau nama pengguna..."
            data={mockBookings}
            columns={columns}
            perPage={10}
            addButtonLabel="Tambah Booking"
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
