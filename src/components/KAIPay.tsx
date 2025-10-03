"use client";

import React from "react";
import Icon from "@/components/ui/Icon";

interface KAIPayProps {
    balance?: number;
    railPoint?: number;
    premiumLabel?: string;
    onScan?: () => void;
    onTopUp?: () => void;
    onHistory?: () => void;
}

const formatCurrency = (value = 0) => {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(value);
};

const KAIPay: React.FC<KAIPayProps> = ({
    balance = 0,
    railPoint = 0,
    premiumLabel = "Premium",
    onScan,
    onTopUp,
    onHistory,
}) => {
    return (
        <div className="w-full px-4 pt-40 flex items-center justify-center">
            <div className="max-w-[95rem] w-full rounded-2xl shadow-2xl overflow-hidden mx-auto" style={{ background: `linear-gradient(90deg,#294bb5 0%,#3b82f6 100%)` }}>
                <div className="px-6 py-8 md:px-10 md:py-10 flex items-center justify-between">
                    {/* Left: icon + labels */}
                    <div className="flex-1">
                        <div className="flex items-center gap-4">
                            <img src="/ic_ewallet_white.svg" alt="E-Wallet" className="w-8 h-8" />
                            <div className="text-white font-semibold">KAI PAY</div>
                        </div>

                        <div className="mt-6 text-white/80 text-sm">Saldo</div>
                        <div className="text-white text-4xl md:text-5xl font-bold mt-2">Rp {formatCurrency(balance)}</div>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-300 text-white text-sm font-medium">{railPoint} Railpoin</div>
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 text-black text-sm font-medium">{premiumLabel}</div>
                        </div>
                    </div>

                    {/* Right: action buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onScan}
                            aria-label="Scan"
                            className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex flex-col items-center justify-center text-white hover:bg-white/20 transition"
                        >
                            <img src="/ic_qris_white.svg" alt="QRCode" />
                            <span className="text-xs mt-1">Scan</span>
                        </button>

                        <button
                            onClick={onTopUp}
                            aria-label="Top Up"
                            className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex flex-col items-center justify-center text-white hover:bg-white/20 transition"
                        >
                            <Icon name="plus" className="w-6 h-6" />
                            <span className="text-xs mt-1">TopUp</span>
                        </button>

                        <button
                            onClick={onHistory}
                            aria-label="History"
                            className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex flex-col items-center justify-center text-white hover:bg-white/20 transition"
                        >
                            <img src="/ic_history_white.svg" alt="History" />
                            <span className="text-xs mt-1">History</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KAIPay;
