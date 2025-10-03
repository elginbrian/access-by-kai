'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useReviews, useMyReviews } from '@/lib/hooks/useNotifications';
import { JenisLayanan, ReviewFilters } from '@/types/notification';
import ReviewItem from '@/components/reviews/ReviewItem';
import CreateReviewForm from '@/components/reviews/CreateReviewForm';

const ReviewsPage: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'create'>('all');
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 10,
  });

  const serviceFromUrl = searchParams.get('service') as JenisLayanan | null;
  
  // Fetch all reviews
  const { data: allReviews, isLoading: allLoading } = useReviews(filters);
  
  // Fetch user's reviews
  const { data: myReviews, isLoading: myLoading } = useMyReviews(
    activeTab === 'my' && user?.profile?.user_id ? user.profile.user_id.toString() : undefined
  );

  const handleFilterChange = (newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Silakan Login
          </h2>
          <p className="text-gray-600">
            Anda perlu login untuk melihat dan membuat ulasan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ulasan Layanan
              </h1>
              <p className="mt-2 text-gray-600">
                Lihat dan bagikan pengalaman menggunakan layanan KAI
              </p>
            </div>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Semua Ulasan
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ulasan Saya
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buat Ulasan
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* All Reviews Tab */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-4">
                  <select
                    value={filters.jenis_layanan || ''}
                    onChange={(e) => handleFilterChange({ 
                      jenis_layanan: e.target.value as JenisLayanan || undefined 
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Semua Layanan</option>
                    <option value="BOOKING_TIKET">Pemesanan Tiket</option>
                    <option value="EPORTER">E-Porter</option>
                    <option value="LOGISTIK">Logistik</option>
                    <option value="LAPORAN_MANUAL">Laporan Manual</option>
                  </select>

                  <select
                    value={filters.penilaian || ''}
                    onChange={(e) => handleFilterChange({ 
                      penilaian: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Semua Rating</option>
                    <option value="5">5 Bintang</option>
                    <option value="4">4 Bintang</option>
                    <option value="3">3 Bintang</option>
                    <option value="2">2 Bintang</option>
                    <option value="1">1 Bintang</option>
                  </select>
                </div>

                {/* Reviews List */}
                {allLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allReviews?.data?.length === 0 ? (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Belum ada ulasan
                        </h3>
                        <p className="text-gray-500">
                          Belum ada ulasan untuk filter yang dipilih.
                        </p>
                      </div>
                    ) : (
                      allReviews?.data?.map((review) => (
                        <ReviewItem 
                          key={review.ulasan_id} 
                          review={review} 
                          showUserInfo={true}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Pagination */}
                {allReviews && allReviews.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 pt-6">
                    <button
                      onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                      disabled={filters.page === 1}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      ← Sebelumnya
                    </button>
                    
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Halaman {filters.page || 1} dari {allReviews.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(Math.min(allReviews.totalPages, (filters.page || 1) + 1))}
                      disabled={filters.page === allReviews.totalPages}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* My Reviews Tab */}
            {activeTab === 'my' && (
              <div className="space-y-4">
                {myLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {myReviews?.data?.length === 0 ? (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Belum ada ulasan
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Anda belum membuat ulasan apapun.
                        </p>
                        <button
                          onClick={() => setActiveTab('create')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Buat Ulasan Pertama
                        </button>
                      </div>
                    ) : (
                      myReviews?.data?.map((review) => (
                        <ReviewItem 
                          key={review.ulasan_id} 
                          review={review} 
                          canEdit={true}
                        />
                      ))
                    )}
                  </>
                )}
              </div>
            )}

            {/* Create Review Tab */}
            {activeTab === 'create' && (
              <CreateReviewForm
                userId={user.profile?.user_id || 0}
                serviceType={serviceFromUrl || undefined}
                onSuccess={() => {
                  setActiveTab('my');
                  // Refresh my reviews
                }}
              />
            )}
          </div>
        </div>

        {/* Statistics */}
        {activeTab === 'all' && allReviews && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistik Ulasan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {allReviews.total}
                </div>
                <div className="text-sm text-gray-600">Total Ulasan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {allReviews.averageRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Rating Rata-rata</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {allReviews.data?.filter(r => r.penilaian >= 4).length || 0}
                </div>
                <div className="text-sm text-gray-600">Ulasan Positif (4+ ⭐)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;