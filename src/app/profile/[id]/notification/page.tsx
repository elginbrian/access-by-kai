'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import NotificationList from '@/components/notifications/NotificationList';

const NotificationPage: React.FC = () => {
  const params = useParams();
  const userId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Notifikasi
              </h1>
              <p className="mt-2 text-gray-600">
                Pantau semua aktivitas dan update terbaru dari akun Anda
              </p>
            </div>
            
            {/* Back button */}
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kembali
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <NotificationList 
              userId={userId}
              showFilters={true}
              itemsPerPage={15}
            />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            💡 Tips Notifikasi
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Gunakan filter untuk mencari notifikasi tertentu</li>
            <li>• Klik "Baca" untuk menandai notifikasi sebagai sudah dibaca</li>
            <li>• Gunakan "Tandai Semua Dibaca" untuk menandai semua notifikasi sekaligus</li>
            <li>• Notifikasi dengan prioritas tinggi ditampilkan dengan warna merah</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;