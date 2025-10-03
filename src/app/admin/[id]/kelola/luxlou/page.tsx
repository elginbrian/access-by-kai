"use client";

import React from 'react';
import TableKelola, { Column } from '@/components/admin/table/TableKelola';
import ChartMultiLine from '@/components/admin/chart/ChartMultiLine';
import ChartMultiBar from '@/components/admin/chart/ChartMultiBar';

// Mock data for lounge reservations
const mockReservations = [
  {
    id: 'RLX001',
    customerName: 'Dr. Amanda Sari',
    route: 'Argo Bromo - Surabaya',
    time: '14:00',
    status: 'Aktif',
    revenue: 'Rp 850,000',
  },
  {
    id: 'RLX002', 
    customerName: 'Bapak Widodo',
    route: 'Gajayana - Malang',
    time: '15:35',
    status: 'Confirmed',
    revenue: 'Rp 650,000',
  },
  {
    id: 'RLX003',
    customerName: 'Ibu Kartini',
    route: 'Bima - Semarang', 
    time: '12:45',
    status: 'Selesai',
    revenue: 'Rp 1,200,000',
  },
];

const reservationColumns: Column<any>[] = [
  { key: 'id', label: 'ID Reservasi', render: (r) => <div className="font-mono text-sm">{r.id}</div> },
  { key: 'customerName', label: 'Nama Tamu', render: (r) => <div className="font-semibold">{r.customerName}</div> },
  { key: 'route', label: 'Kereta Tujuan', render: (r) => <div className="text-sm">{r.route}</div> },
  { key: 'time', label: 'Check-in', render: (r) => <div className="font-mono">{r.time}</div> },
  { key: 'status', label: 'Status', render: (r) => (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
      r.status === 'Aktif' ? 'bg-green-100 text-green-700' :
      r.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
      'bg-gray-100 text-gray-700'
    }`}>
      {r.status}
    </span>
  )},
  { key: 'revenue', label: 'Revenue', render: (r) => <div className="font-semibold">{r.revenue}</div> },
];

export default function LuxuryLoungePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Luxury Lounge</h1>
            <p className="text-sm text-gray-500">Manage premium lounge reservations and VIP services</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600">
              Buat Rencana Sambutan
            </button>
            <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
              <img src="/ic_person.svg" alt="Profile" className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* VIP Planning Banner */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">🏆 AI Perencanaan Lounge VIP</h3>
              <div className="space-y-2 text-sm">
                <p>✨ Saat sambutan VIP akan tiba di Lounge Gambir jam 14:00</p>
                <p>🥂 Siapat sambutan spesial: Sarapan abstrak Econohai, banquet kecil sudah disajikan.</p>
                <p>🏆 Tamu staff: Siapkan snack premium & reservasi ruang meeting.</p>
                <p>⭐ Kamar reservasi ke staf lounge 30 menit Reach time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">2.5 jam</div>
            <div className="text-sm text-gray-500 mt-1">Rata-rata Lama Kunjungan</div>
            <div className="text-xs text-green-600 mt-2">29m lebih tinggi ini</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">87%</div>
            <div className="text-sm text-gray-500 mt-1">Tingkat Kepuasan</div>
            <div className="text-xs text-green-600 mt-2">4% naik minggu lalu</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-800">Rp 45.2M</div>
            <div className="text-sm text-gray-500 mt-1">Revenue Lounge Minggu Ini</div>
            <div className="text-xs text-green-600 mt-2">15% naik minggu lalu</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Visitor Trends Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Jumlah Tamu Lounge Per Hari</h4>
            <ChartMultiLine
              width={400}
              height={250}
              xLabels={["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]}
              series={[
                {
                  id: 'visitors',
                  name: 'Tamu VIP',
                  color: '#f59e0b',
                  values: [15, 18, 22, 28, 35, 40, 30]
                }
              ]}
              yTicks={[0, 10, 20, 30, 40]}
              showLegend={true}
            />
          </div>

          {/* Facility Usage Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Penggunaan Fasilitas Lounge</h4>
            <div className="h-64">
              <ChartMultiBar
                width={400}
                height={250}
                categories={["Meeting Room", "Shower", "Dining", "Work Area", "Rest Area"]}
                series={[
                  {
                    name: 'Penggunaan (%)',
                    color: '#f59e0b',
                    values: [65, 78, 85, 90, 72]
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">Daftar Reservasi Lounge</h4>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600">
              + Tambah Reservasi
            </button>
          </div>
          
          <TableKelola
            data={mockReservations}
            columns={reservationColumns}
            perPage={10}
            onEdit={(row) => console.log('Edit reservation:', row)}
            onDelete={(row) => console.log('Delete reservation:', row)}
          />
        </div>
      </div>
    </div>
  );
}
