"use client";

import React from "react";
import AiRecomendationCard from '@/components/admin/card/AiRecomendationCard';
import ChartMultiBar from '@/components/admin/chart/ChartMultiBar';
import ChartMultiLine from '@/components/admin/chart/ChartMultiLine';
import TableKelola, { Column } from '@/components/admin/table/TableKelola';
import PopularTrainCard from '@/components/admin/card/PopularTrainCard';

type PorterRow = {
  id: string;
  namaPorter: string;
  nomorTelepon: string;
  stasiun: string;
  status: 'Aktif' | 'Nonaktif';
  tugasSelesai: number;
  rating: number;
  layananTags: string[];
};

type BookingRow = {
  id: string;
  namaPemesan: string;
  nomorKereta: string;
  waktuKeberangkatan: string;
  jenisLayanan: string;
  status: 'Menunggu' | 'Aktif' | 'Selesai' | 'Dibatalkan';
  porter?: string;
};

const samplePorterData: PorterRow[] = [
  { id: 'PRT001', namaPorter: 'Ahmad Wijaya', nomorTelepon: '+628111000111', stasiun: 'Gambir', status: 'Aktif', tugasSelesai: 12, rating: 4.8, layananTags: ['bawa_bagasi', 'difabel_assist'] },
  { id: 'PRT002', namaPorter: 'Siti Porter', nomorTelepon: '+628111000222', stasiun: 'Bandung', status: 'Aktif', tugasSelesai: 8, rating: 4.6, layananTags: ['bawa_bagasi', 'anak_bayi'] },
  { id: 'PRT003', namaPorter: 'Budi Porter', nomorTelepon: '+628111000333', stasiun: 'Yogyakarta', status: 'Nonaktif', tugasSelesai: 0, rating: 4.2, layananTags: ['express'] },
];

const sampleBookingData: BookingRow[] = [
  { id: '#EP001', namaPemesan: 'Sari Dewi', nomorKereta: 'KA 123 - Jakarta/Surabaya', waktuKeberangkatan: '14:30', jenisLayanan: 'Bantuan Bagasi', status: 'Menunggu' },
  { id: '#EP002', namaPemesan: 'Andi Rahman', nomorKereta: 'KA 456 - Bandung/Jakarta', waktuKeberangkatan: '15:45', jenisLayanan: 'Difabel Assist', status: 'Aktif', porter: 'Ahmad Wijaya' },
  { id: '#EP003', namaPemesan: 'Maya Sari', nomorKereta: 'KA 789 - Yogya/Jakarta', waktuKeberangkatan: '13:15', jenisLayanan: 'Bantuan Anak & Bayi', status: 'Selesai', porter: 'Siti Porter' },
  { id: '#EP004', namaPemesan: 'Dodi Santoso', nomorKereta: 'KA 202 - Jakarta/Bandung', waktuKeberangkatan: '16:20', jenisLayanan: 'Express', status: 'Dibatalkan' },
];

export default function Page() {
  const porterColumns: Column<PorterRow>[] = [
    { key: 'namaPorter', label: 'Nama Porter', render: (row) => <div className="font-medium text-gray-800">{row.namaPorter}</div> },
    { key: 'nomorTelepon', label: 'Nomor Telepon', render: (row) => <div className="text-sm text-gray-600">{row.nomorTelepon}</div> },
    { key: 'stasiun', label: 'Stasiun', render: (row) => <div className="text-sm text-gray-700">{row.stasiun}</div> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    { 
      key: 'tugasSelesai', 
      label: 'Tugas Selesai Hari Ini',
      render: (row) => <span className="text-sm text-gray-700">{row.tugasSelesai}</span>
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700">{row.rating}</span>
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )
    },
  ];

  const bookingColumns: Column<BookingRow>[] = [
    { key: 'id', label: 'ID Booking', render: (row) => <div className="font-medium text-gray-800">{row.id}</div> },
    { key: 'namaPemesan', label: 'Nama Pemesan', render: (row) => <div className="text-sm text-gray-700">{row.namaPemesan}</div> },
    { key: 'nomorKereta', label: 'Nomor Kereta / Rute', render: (row) => <div className="text-sm text-gray-600">{row.nomorKereta}</div> },
    { key: 'waktuKeberangkatan', label: 'Waktu Keberangkatan', render: (row) => <div className="text-sm text-gray-700">{row.waktuKeberangkatan}</div> },
    { key: 'jenisLayanan', label: 'Jenis Layanan', render: (row) => <div className="text-sm text-gray-700">{row.jenisLayanan}</div> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'Selesai' ? 'bg-green-100 text-green-700' :
          row.status === 'Aktif' ? 'bg-blue-100 text-blue-700' :
          row.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {row.status}
        </span>
      ),
    },
    { key: 'porter', label: 'Porter Assigned', render: (row) => <div className="text-sm text-gray-700">{row.porter || '-'}</div> },
  ];

  const barData = {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
    series: [
      { name: 'Permintaan Porter', color: '#6d28d9', values: [20, 18, 15, 10, 12, 22] }
    ]
  };

  const lineData = [
    { id: 'permintaan', name: 'Permintaan Harian', color: '#6d28d9', values: [35, 42, 38, 45, 50, 48, 40] }
  ];

  const popularServices = [
    { id: '1', title: 'Bantuan Bagasi', passengers: '85 permintaan', occupancyPercent: 92, revenue: 'Rp 2.5M' },
    { id: '2', title: 'Difabel Assist', passengers: '32 permintaan', occupancyPercent: 78, revenue: 'Rp 960K' },
    { id: '3', title: 'Anak & Bayi', passengers: '28 permintaan', occupancyPercent: 65, revenue: 'Rp 840K' },
    { id: '4', title: 'Express Service', passengers: '15 permintaan', occupancyPercent: 88, revenue: 'Rp 750K' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola e-Porter</h1>
            <p className="text-sm text-gray-500">Mengelola porter dan permintaan layanan bantuan penumpang</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">Real-time Analysis</div>
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">A</div>
          </div>
        </header>

        {/* AI Recommendation Card */}
        <AiRecomendationCard
          title="AI Insight e-Porter"
          subtitle="Optimisasi layanan porter berbasis AI dan analisis real-time"
          items={[
            { text: 'Hari ini ada 15 permintaan porter di seluruh stasiun.', tone: 'info' },
            { text: 'Stasiun Gambir memiliki jumlah booking tertinggi: 120 permintaan.', tone: 'warning' },
            { text: 'Rata-rata waktu respons porter: 3.2 menit (target: 5 menit).', tone: 'success' },
            { text: 'Total 28 porter aktif terdaftar di sistem.', tone: 'info' },
          ]}
          cta={{ label: 'Lihat Detail Statistik', variant: 'primary', onClick: () => console.log('detail stats') }}
        />

        {/* Metrics and Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-sm text-gray-500">Porter Aktif</div>
                <div className="text-2xl font-bold text-gray-800 mt-2">28</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-sm text-gray-500">Permintaan Hari Ini</div>
                <div className="text-2xl font-bold text-gray-800 mt-2">15</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-sm text-gray-500">Rata-rata Respons</div>
                <div className="text-2xl font-bold text-gray-800 mt-2">3.2 min</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Permintaan Porter per Stasiun (7 Hari Terakhir)</h4>
              <ChartMultiBar
                categories={barData.categories}
                series={barData.series}
                height={260}
                width={680}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Tren Permintaan Porter</h4>
              <ChartMultiLine
                xLabels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']}
                series={lineData}
                width={280}
                height={200}
              />
            </div>

            <PopularTrainCard 
              title="Layanan Porter Populer"
              items={popularServices}
            />
          </div>
        </div>

        {/* Porter Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <TableKelola
            title="Data Porter"
            description="Kelola data porter dan status ketersediaan"
            data={samplePorterData as any}
            columns={porterColumns as any}
            perPage={10}
            onEdit={(r) => console.log('edit porter', r)}
            onDelete={(r) => console.log('delete porter', r)}
            addButtonLabel="Tambah Data Porter"
            onAdd={() => console.log('add porter')}
          />
        </div>

        {/* Booking Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <TableKelola
            title="Daftar Permintaan e-Porter"
            description="Kelola permintaan layanan porter dari penumpang"
            data={sampleBookingData as any}
            columns={bookingColumns as any}
            perPage={10}
            onEdit={(r) => console.log('edit booking', r)}
            onDelete={(r) => console.log('delete booking', r)}
            addButtonLabel=""
            onAdd={undefined}
          />
        </div>
      </div>
    </div>
  );
}
