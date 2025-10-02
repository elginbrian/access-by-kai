import React from "react";
import { colors } from "@/app/design-system";

interface EmptyStateMessageProps {
  type: "loading" | "error" | "noResults" | "noResultsWithFilters" | "browsing";
  hasSearchCriteria?: boolean;
  hasActiveFilters?: boolean;
  errorMessage?: string;
  onEditSchedule?: () => void;
  onResetFilters?: () => void;
  onSearchSpecific?: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ type, hasSearchCriteria = false, hasActiveFilters = false, errorMessage, onEditSchedule, onResetFilters, onSearchSpecific }) => {
  if (type === "loading") {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-lg text-gray-600">{hasSearchCriteria ? "Mencari jadwal kereta..." : "Memuat semua kereta tersedia..."}</span>
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-medium mb-2">Terjadi Kesalahan</div>
        <div className="text-red-500 text-sm">{errorMessage || "Gagal memuat jadwal kereta. Silakan coba lagi atau periksa koneksi internet Anda."}</div>
      </div>
    );
  }

  if (type === "noResults") {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-600 font-medium mb-2">{hasSearchCriteria ? "Tidak Ada Jadwal Kereta" : "Tidak Ada Kereta Tersedia"}</div>
        <div className="text-gray-500 text-sm mb-4">
          {hasSearchCriteria ? "Maaf, tidak ada jadwal kereta yang tersedia untuk rute dan tanggal yang Anda pilih." : "Maaf, tidak ada kereta yang tersedia saat ini. Silakan coba lagi nanti."}
        </div>
        {hasSearchCriteria && onEditSchedule && (
          <button onClick={onEditSchedule} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Ubah Pencarian
          </button>
        )}
      </div>
    );
  }

  if (type === "noResultsWithFilters") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-600 font-medium mb-2">Tidak Ada Hasil Sesuai Filter</div>
        <div className="text-gray-500 text-sm mb-4">
          {hasActiveFilters ? "Coba sesuaikan filter harga, kelas kereta, atau waktu keberangkatan untuk melihat lebih banyak pilihan." : "Tidak ada kereta yang tersedia untuk kriteria pencarian Anda."}
        </div>
        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: colors.violet.normal,
              color: colors.base.light,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.violet.normalHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.violet.normal;
            }}
          >
            Reset Semua Filter
          </button>
        )}
      </div>
    );
  }

  if (type === "browsing") {
    return (
      <div
        className="rounded-lg p-6"
        style={{
          background: `linear-gradient(to right, ${colors.violet.light}, ${colors.blue.light})`,
          borderColor: colors.violet.lightActive,
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.violet.dark }}>
              Jelajahi Semua Kereta Tersedia
            </h3>
            <p className="text-sm" style={{ color: colors.violet.normalActive }}>
              Anda sedang melihat semua kereta yang tersedia. Gunakan filter di sebelah kiri untuk menyaring berdasarkan preferensi Anda, atau lakukan pencarian spesifik untuk rute dan tanggal tertentu.
            </p>
          </div>
          {onSearchSpecific && (
            <button
              onClick={onSearchSpecific}
              className="px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-4"
              style={{
                backgroundColor: colors.violet.normal,
                color: colors.base.light,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.violet.normalHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.violet.normal;
              }}
            >
              Cari Rute Spesifik
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EmptyStateMessage;
