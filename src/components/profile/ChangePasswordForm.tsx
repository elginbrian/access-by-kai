"use client";

import React, { useState } from 'react';
import InputField from '@/components/input/InputField';
import { colors } from '@/app/design-system/colors';

interface ChangePasswordFormProps {
    onCancel?: () => void;
    onSubmit?: (data: { oldPassword: string; newPassword: string; confirmPassword: string }) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onCancel, onSubmit }) => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Kata sandi lama harus diisi';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'Kata sandi baru harus diisi';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Kata sandi minimal 8 karakter';
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Kata sandi harus kombinasi huruf dan angka';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi kata sandi harus diisi';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi kata sandi tidak sesuai';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                await onSubmit?.(formData);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const EyeIcon = ({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) => (
        <button
            type="button"
            onClick={onClick}
            className="p-1 hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-110"
            style={{ color: colors.base.darkActive }}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isVisible ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L12 12m-3.658-3.658l-1.414-1.414m4.242 4.242L12 12m0 0l4.242 4.242M12 12l-3.658 3.658" />
                )}
            </svg>
        </button>
    );

    return (
        <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mx-auto"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                >
                    <img src="/ic_lock_blue.svg" alt="Image" />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: colors.base.darker }}>
                    Ganti Kata Sandi
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Old Password */}
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.base.darker }}>
                        Kata Sandi Lama
                    </label>
                    <InputField
                        type={showPasswords.oldPassword ? 'text' : 'password'}
                        label="Masukkan kata sandi lama"
                        value={formData.oldPassword}
                        onChange={handleInputChange('oldPassword')}
                        style={{
                            borderColor: errors.oldPassword ? colors.red.normal : colors.base.normalActive
                        }}
                    />
                    {errors.oldPassword && (
                        <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                            {errors.oldPassword}
                        </span>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.base.darker }}>
                        Kata Sandi Baru
                    </label>
                    <InputField
                        type={showPasswords.newPassword ? 'text' : 'password'}
                        label="Masukkan kata sandi baru"
                        value={formData.newPassword}
                        onChange={handleInputChange('newPassword')}
                        style={{
                            borderColor: errors.newPassword ? colors.red.normal : colors.base.normalActive
                        }}
                    />
                    {errors.newPassword && (
                        <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                            {errors.newPassword}
                        </span>
                    )}
                </div>

                {/* Help Text */}
                <div className="text-sm" style={{ color: colors.base.darkActive }}>
                    Minimal 8 karakter, kombinasi huruf dan angka
                </div>

                {/* Confirm New Password */}
                <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.base.darker }}>
                        Konfirmasi Kata Sandi Baru
                    </label>
                    <InputField
                        type={showPasswords.confirmPassword ? 'text' : 'password'}
                        label="Konfirmasi kata sandi baru"
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        style={{
                            borderColor: errors.confirmPassword ? colors.red.normal : colors.base.normalActive
                        }}
                    />
                    {errors.confirmPassword && (
                        <span className="text-xs mt-1 block" style={{ color: colors.red.normal }}>
                            {errors.confirmPassword}
                        </span>
                    )}
                </div>

                {/* Warning Box */}
                <div
                    className="rounded-xl p-4 border border-yellow-200 bg-yellow-50"
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                            <img src="/ic_warning_yellow.svg" alt="Image" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm mb-1 text-yellow-700">Perhatian</div>
                            <div className="text-sm text-yellow-600">
                                Setelah mengubah kata sandi, Anda akan diminta untuk login ulang di semua perangkat.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:border-gray-400 hover:shadow-md"
                        style={{ color: colors.base.darker }}
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        style={{
                            background: isSubmitting
                                ? colors.base.disabled
                                : `linear-gradient(135deg, ${colors.blue.normal} 0%, ${colors.blue.darker} 100%)`,
                            boxShadow: isSubmitting
                                ? 'none'
                                : '0 4px 12px rgba(74, 144, 226, 0.25)'
                        }}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Menyimpan...
                            </div>
                        ) : (
                            'Simpan Perubahan'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;