"use client";

import React, { useState } from "react";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import WalletCard from "@/components/profile/payment/WalletCard";
import CouponCard from "@/components/profile/payment/CouponCard";
import { colors } from "@/app/design-system";
import type { Pengguna } from "@/types/models";

interface Props {
  profile: Pengguna;
}

const PayCardProfilePageClient: React.FC<Props> = ({ profile }) => {
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [kaiPayBalance, setKaiPayBalance] = useState(850000);
    const [railPointBalance] = useState(12450);

    const handleTopUp = (amount: number) => {
        setKaiPayBalance((prev) => prev + amount);
    };

    const handleCouponRedeem = (couponTitle: string) => {
        // Handle coupon redemption logic here
    };

    const coupons = [
        {
            title: "Diskon Tiket Kereta",
            discount: "15%",
            description: "Diskon 15% untuk pembelian tiket kereta api",
            terms: "Minimal pembelian Rp 100.000. Berlaku untuk semua rute.",
            expiry: "Berlaku hingga 31 Des 2024",
        },
        {
            title: "Cashback Makanan",
            discount: "20%",
            description: "Cashback 20% untuk pemesanan makanan di kereta",
            terms: "Maksimal cashback Rp 50.000 per transaksi.",
            expiry: "Berlaku hingga 15 Jan 2025",
        },
        {
            title: "Gratis Biaya Admin",
            discount: "100%",
            description: "Bebas biaya admin untuk transaksi berikutnya",
            terms: "Berlaku untuk 1x transaksi pembelian tiket.",
            expiry: "Berlaku hingga 30 Nov 2024",
        },
    ];

    // Local TopUp modal content component
    const TopUpModalContent: React.FC<{ onClose: () => void; onTopUp: (amount: number) => void }> = ({ onClose, onTopUp }) => {
        const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
        const [customAmount, setCustomAmount] = useState("");

        const predefinedAmounts = [100000, 250000, 500000, 1000000];

        const handleTopUpClick = () => {
            const amount = selectedAmount || parseInt(customAmount);
            if (amount && amount >= 10000) {
                onTopUp(amount);
                onClose();
            }
        };

        return (
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Nominal</label>
                    <div className="grid grid-cols-2 gap-3">
                        {predefinedAmounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => {
                                    setSelectedAmount(amount);
                                    setCustomAmount("");
                                }}
                                className={`p-3 text-sm font-medium rounded-lg border transition-all ${selectedAmount === amount ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                Rp {amount.toLocaleString("id-ID")}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Atau Masukkan Nominal</label>
                    <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                        }}
                        placeholder="Minimal Rp 10.000"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 px-4 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
                    <button
                        onClick={handleTopUpClick}
                        disabled={!selectedAmount && !customAmount}
                        className="flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)` }}
                    >
                        Top Up
                    </button>
                </div>
            </div>
        );
    };

    function formatCurrency(value: any): React.ReactNode {
        if (value === null || value === undefined || value === "") return "0";
        const num =
            typeof value === "number"
                ? value
                : Number(String(value).replace(/[^\d.-]/g, ""));
        if (Number.isNaN(num)) return "0";
        // Format without decimal places for Indonesian Rupiah style (e.g. 1.000.000)
        return num.toLocaleString("id-ID", { maximumFractionDigits: 0 });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-8">
                            <ProfileSidebar
                                profile={profile}
                                kaiPayBalance={kaiPayBalance}
                                railPointBalance={railPointBalance}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <WalletCard type="kaipay" balance={kaiPayBalance} icon="/ic_ewallet_white.svg" iconAlt="KAI Pay" onClick={() => setIsTopUpModalOpen(true)} />
                            <WalletCard type="railpoint" balance={railPointBalance} icon="/ic_star_white.svg" iconAlt="RaiPoint" onClick={() => {}} />
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border p-8">
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Kupon Tersedia</h3>
                                    <span className="text-sm text-gray-600 mb-4">Manfaatkan kupon diskon dari RaiPoin dan saldo KAI Pay Anda</span>
                                    <div className="w-full">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <img src="/ic_star_orange.svg" alt="RaiPoin" className="w-5 h-5" />
                                                    <h3 className="text-md font-semibold text-gray-900">Kupon RaiPoin</h3>
                                                </div>
                                                {coupons.map((coupon, index) => (
                                                    <CouponCard
                                                        key={index}
                                                        title={coupon.title}
                                                        discount={coupon.discount}
                                                        description={coupon.description}
                                                        terms={coupon.terms}
                                                        expiry={coupon.expiry}
                                                        onRedeem={() => handleCouponRedeem(coupon.title)}
                                                    />
                                                ))}
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <img src="/ic_ewallet_blue.svg" alt="E-Wallet" className="w-5 h-5" />
                                                    <h3 className="text-md font-semibold text-gray-900">Saldo KAI Pay</h3>
                                                </div>

                                                <div className="flex flex-col gap-4 p-4 bg-blue-600 rounded-xl">
                                                    <p>Saldo Tersedia</p>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-lg font-semibold text-white">Rp {formatCurrency(kaiPayBalance)}</p>
                                                        <img src="/ic_ewallet_white.svg" alt="E-Wallet" className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTopUp(10000)}
                                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-200/50 py-2 px-3 rounded-lg"
                                                        >
                                                            <img src="/ic_plus.svg" alt="Tambah" className="w-5 h-5" />
                                                            <p className="text-white text-sm font-medium m-0">Top Up</p>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-200/50 py-2 px-3 rounded-lg"
                                                        >
                                                            <img src="/ic_riwayat.svg" alt="Riwayat" className="w-5 h-5" />
                                                            <p className="text-white m-0">Riwayat</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayCardProfilePageClient;