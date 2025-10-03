"use client";

import React, { useState } from "react";

interface TransferTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (nikTarget: string, namaTarget: string) => Promise<void>;
  ticketNumber: string;
  isLoading?: boolean;
}

const TransferTicketModal: React.FC<TransferTicketModalProps> = ({
  isOpen,
  onClose,
  onTransfer,
  ticketNumber,
  isLoading = false,
}) => {
  const [nikTarget, setNikTarget] = useState("");
  const [namaTarget, setNamaTarget] = useState("");
  const [errors, setErrors] = useState<{ nik?: string; nama?: string }>({});

  const validateForm = () => {
    const newErrors: { nik?: string; nama?: string } = {};
    
    if (!nikTarget.trim()) {
      newErrors.nik = "NIK harus diisi";
    } else if (!/^\d+$/.test(nikTarget)) {
      newErrors.nik = "NIK hanya boleh berisi angka";
    }

    if (!namaTarget.trim()) {
      newErrors.nama = "Nama lengkap harus diisi";
    } else if (namaTarget.trim().length < 3) {
      newErrors.nama = "Nama minimal 3 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onTransfer(nikTarget.trim(), namaTarget.trim());
      handleClose();
    } catch (error) {
      // Error handling akan dilakukan di parent component
    }
  };

  const handleClose = () => {
    setNikTarget("");
    setNamaTarget("");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Transfer Tiket</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">No. Tiket: {ticketNumber}</h3>
                <p className="text-sm text-gray-600">Transfer kepemilikan tiket ke pengguna lain</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Perhatian!</p>
                  <ul className="space-y-1">
                    <li>• Transfer tiket bersifat permanen dan tidak dapat dibatalkan</li>
                    <li>• Pastikan data NIK dan nama sesuai dengan pengguna terdaftar</li>
                    <li>• Setelah transfer, tiket akan menjadi milik pengguna baru</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="nikTarget" className="block text-sm font-medium text-gray-700 mb-2">
                NIK Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nikTarget"
                value={nikTarget}
                onChange={(e) => setNikTarget(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nik ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Masukkan NIK penerima tiket"
                disabled={isLoading}
              />
              {errors.nik && (
                <p className="mt-1 text-sm text-red-600">{errors.nik}</p>
              )}
            </div>

            <div>
              <label htmlFor="namaTarget" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap Penerima <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaTarget"
                value={namaTarget}
                onChange={(e) => setNamaTarget(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.nama ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Masukkan nama lengkap penerima"
                disabled={isLoading}
              />
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600">{errors.nama}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                "Transfer Tiket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferTicketModal;