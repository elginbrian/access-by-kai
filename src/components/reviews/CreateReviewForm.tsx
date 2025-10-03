import React, { useState } from 'react';
import { JenisLayanan, CreateReviewRequest } from '@/types/notification';
import { useCreateReview } from '@/lib/hooks/useNotifications';

interface CreateReviewFormProps {
  userId: number;
  serviceType?: JenisLayanan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const serviceOptions: { value: JenisLayanan; label: string }[] = [
  { value: 'BOOKING_TIKET', label: 'Pemesanan Tiket' },
  { value: 'EPORTER', label: 'E-Porter' },
  { value: 'LOGISTIK', label: 'Logistik' },
  { value: 'LAPORAN_MANUAL', label: 'Laporan Manual' },
];

const CreateReviewForm: React.FC<CreateReviewFormProps> = ({
  userId,
  serviceType,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateReviewRequest>({
    pengguna_id: userId,
    jenis_layanan: serviceType || 'BOOKING_TIKET',
    penilaian: 5,
    komentar: '',
    platform: 'UMUM',
  });

  const createReviewMutation = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.komentar.trim()) {
      alert('Silakan tulis komentar Anda');
      return;
    }

    createReviewMutation.mutate(formData, {
      onSuccess: () => {
        onSuccess?.();
        // Reset form
        setFormData({
          pengguna_id: userId,
          jenis_layanan: serviceType || 'BOOKING_TIKET',
          penilaian: 5,
          komentar: '',
          platform: 'UMUM',
        });
      },
      onError: (error) => {
        console.error('Failed to create review:', error);
        alert('Gagal membuat ulasan. Silakan coba lagi.');
      },
    });
  };

  const renderStars = (currentRating: number, onChange: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className={`text-2xl transition-colors ${
              index < currentRating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
            }`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({currentRating}/5)
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Buat Ulasan Baru
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Type Selection */}
        {!serviceType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Layanan
            </label>
            <select
              value={formData.jenis_layanan}
              onChange={(e) => setFormData(prev => ({ ...prev, jenis_layanan: e.target.value as JenisLayanan }))}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penilaian
          </label>
          {renderStars(formData.penilaian, (rating) => 
            setFormData(prev => ({ ...prev, penilaian: rating }))
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Komentar <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.komentar}
            onChange={(e) => setFormData(prev => ({ ...prev, komentar: e.target.value }))}
            placeholder="Bagikan pengalaman Anda menggunakan layanan ini..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 karakter ({formData.komentar.length}/10)
          </p>
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="UMUM">Umum</option>
            <option value="MOBILE">Mobile</option>
            <option value="WEB">Web</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            disabled={createReviewMutation.isPending || formData.komentar.length < 10}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {createReviewMutation.isPending ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Mengirim...</span>
              </>
            ) : (
              <span>Kirim Ulasan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReviewForm;