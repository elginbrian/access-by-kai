"use client";
import React, { useState } from "react";
import AiRecomendationCard from '../../../../components/admin/card/AiRecomendationCard';
import TableKelola, { Column } from '../../../../components/admin/table/TableKelola';
import ChartMultiBar from '../../../../components/admin/chart/ChartMultiBar';
import ChartMultiLine from '../../../../components/admin/chart/ChartMultiLine';

type NotificationRow = {
  id: string;
  audience: string;
  content: string;
  target: string;
  status: 'Admin' | 'Pelanggan' | 'Draft';
  waktu: string;
};

const sampleNotificationData: NotificationRow[] = [
  { id: 'NOT-001', audience: 'Penumpang KA Taksaka', content: 'KA Taksaka 15:00 dibatalkan', target: 'Admin', status: 'Admin', waktu: '10:30 AM' },
  { id: 'NOT-002', audience: 'Delay KA Argo Bromo', content: 'Keterlambatan 30 menit...', target: 'Pelanggan', status: 'Pelanggan', waktu: '09:15 AM' },
];

export default function Page() {
  const [selectedTarget, setSelectedTarget] = useState('Admin-Internal');
  const [selectedType, setSelectedType] = useState('Delay');
  const [message, setMessage] = useState('');
  const [sendToInternal, setSendToInternal] = useState(false);
  const [sendToPelanggan, setSendToPelanggan] = useState(false);

  const notificationColumns: Column<NotificationRow>[] = [
    { key: 'id', label: 'ID' },
    { key: 'audience', label: 'Audience' },
    { key: 'content', label: 'Isi Pesan' },
    { key: 'target', label: 'Target' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'Admin' ? 'bg-blue-100 text-blue-800' :
          row.status === 'Pelanggan' ? 'bg-orange-100 text-orange-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      ),
    },
    { key: 'waktu', label: 'Waktu' },
    {
      key: 'aksi',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="text-blue-600 hover:text-blue-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button className="text-green-600 hover:text-green-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="text-red-600 hover:text-red-800">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const barSeries = [
    { name: 'Notifikasi', color: '#6d28d9', values: [25, 15, 8, 35] }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Notifikasi Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor dan kelola notifikasi sistem dengan bantuan AI</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* AI Recommendations Section */}
        <div className="space-y-4">
          <AiRecomendationCard
            title="🔔 AI Rekomendasi Notifikasi"
            subtitle=""
            items={[]}
            cta={{ label: 'Aktif', variant: 'primary' }}
            badge=""
            accentColor="#10b981"
            icon={<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">🔔</span>
            </div>}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-yellow-600 text-xs">⚠️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>⚠️ Data Point Terdeteksi:</strong><br />
                    KA Taksaka keberangkatan 15:00 dibatalkan oleh admin pukul 08:18.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <span className="text-blue-600 text-xs">💡</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>💡 AI Suggestion:</strong><br />
                    • Kirim notif ke internal untuk status perpindahan<br />
                    • Otentifikasi dengan pelanggan untuk penumpang KA Taksaka dengan refund/reschedule
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-md text-sm">
              📝 Buat Draft Notifikasi
            </button>
          </div>
        </div>

        {/* Create Notification Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Buat Notifikasi Baru</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Target</label>
              <select 
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Admin-Internal">Admin-Internal</option>
                <option value="Pelanggan">Pelanggan</option>
                <option value="Semua">Semua</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Notifikasi</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="Delay">Delay</option>
                <option value="Pembatalan">Pembatalan</option>
                <option value="Informasi">Informasi</option>
                <option value="Promo">Promo</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Isi Pesan</label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan notifikasi..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
              />
              <button className="absolute right-3 bottom-3 text-purple-600 hover:text-purple-800 text-sm">
                🪄 Generate with AI
              </button>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendToInternal}
                onChange={(e) => setSendToInternal(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Kirim ke Internal saja</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sendToPelanggan}
                onChange={(e) => setSendToPelanggan(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Kirim juga ke Pelanggan</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
              Kirim Notifikasi
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50">
              Simpan Draft
            </button>
          </div>
        </div>

        {/* Notification History Table */}
        <TableKelola
          title="Riwayat Notifikasi"
          description=""
          data={sampleNotificationData}
          columns={notificationColumns}
          perPage={5}
          onEdit={(r) => console.log('edit notification', r)}
          onDelete={(r) => console.log('delete notification', r)}
          addButtonLabel=""
          onAdd={undefined}
        />

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <ChartMultiBar
              categories={["Admin", "Pembatalan", "Info Operasional", "Promosi"]}
              series={barSeries}
              height={300}
              width={400}
            />
            <div className="text-center mt-2">
              <h4 className="text-sm font-medium text-gray-700">Distribusi Notifikasi per Kategori</h4>
            </div>
          </div>
          
          <div>
            <ChartMultiLine
              xLabels={["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]}
              series={[
                { id: 'internal', name: 'Internal', color: '#3b82f6', values: [65, 55, 70, 75, 80, 70, 65] },
                { id: 'pelanggan', name: 'Pelanggan', color: '#10b981', values: [45, 50, 55, 60, 65, 70, 60] }
              ]}
              title="Engagement rate"
              width={400}
              height={280}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
